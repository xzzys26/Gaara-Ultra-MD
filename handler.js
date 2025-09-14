// Este es el manejador de mensajes que usarán los sub-bots y el bot principal.
import { commands, aliases, testCache, cooldowns } from './index.js';
import config from './config.js';
import { readSettingsDb, readMaintenanceDb } from './lib/database.js';
import print from './lib/print.js';

const COOLDOWN_SECONDS = 5;
const RESPONSE_DELAY_MS = 2000;

// Normalizar y robustecer ownerNumbers para que .includes funcione con LIDs/E.164
try {
  const normalizeDigits = (s) => String(s || '').replace(/[^0-9]/g, '');
  const orig = Array.isArray(config.ownerNumbers) ? config.ownerNumbers : [];
  const ownerSet = new Set(orig.map(normalizeDigits).filter(Boolean));
  const backing = Array.from(ownerSet);
  const flexIncludes = (val) => {
    const s = normalizeDigits(val);
    if (!s) return false;
    for (const o of ownerSet) {
      if (o === s || o.endsWith(s) || s.endsWith(o)) return true;
    }
    return false;
  };
  config.ownerNumbers = new Proxy(backing, {
    get(target, prop, receiver) {
      if (prop === 'includes') return (v) => flexIncludes(v);
      if (prop === 'push') return (...vals) => {
        for (const v of vals) ownerSet.add(normalizeDigits(v));
        return target.push(...vals);
      };
      return Reflect.get(target, prop, receiver);
    }
  });
} catch {}

export async function handler(m, isSubBot = false) { // Se añade isSubBot para diferenciar
  const sock = this;

  try {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

  // Pretty print message to console
  try { await print(msg, sock); } catch {}

    const senderId = msg.key.participant || msg.key.remoteJid;
    msg.sender = senderId; // Adjuntar para fácil acceso

    const from = msg.key.remoteJid;
    let body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    const settings = readSettingsDb();
    const groupPrefix = from.endsWith('@g.us') ? settings[from]?.prefix : null;

    let commandName;
    let args;

    if (groupPrefix) {
      if (!body.startsWith(groupPrefix)) return;
      body = body.slice(groupPrefix.length);
      args = body.trim().split(/ +/).slice(1);
      commandName = body.trim().split(/ +/)[0].toLowerCase();
    } else {
      // Si hay prefijo global o si no hay prefijo de grupo, procesar normal
      const globalPrefix = config.prefix; // Asumiendo que podría haber un prefijo global en config
      if (globalPrefix && !body.startsWith(globalPrefix)) return;
      if (globalPrefix) body = body.slice(globalPrefix.length);

      args = body.trim().split(/ +/).slice(1);
      commandName = body.trim().split(/ +/)[0].toLowerCase();
    }

    let command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (command) {
  const rawNumber = (senderId.split('@')[0]) || '';
  const senderNumber = String(rawNumber).replace(/[^0-9]/g, '');
  const ownerNums = (config.ownerNumbers || []).map(n => String(n).replace(/[^0-9]/g, '')).filter(Boolean);
  const isOwner = ownerNums.some(o => o === senderNumber || o.endsWith(senderNumber) || senderNumber.endsWith(o));

      // Lógica de Permisos Corregida
      if (command.category === 'propietario' && !isOwner) {
        return sock.sendMessage(from, { text: "Este comando es solo para el propietario del bot." });
      }
      if (command.category === 'subbots') {
        // Permitir a todos si está habilitado globalmente; bloquear si en mantenimiento
        const maintenanceList = readMaintenanceDb()
        if (maintenanceList.includes(commandName)) {
          return sock.sendMessage(from, { text: "🛠️ Este comando está en mantenimiento." });
        }
      }

      // Cooldown
      if (cooldowns.has(senderId)) {
        const timeDiff = (Date.now() - cooldowns.get(senderId)) / 1000;
        if (timeDiff < COOLDOWN_SECONDS) return;
      }

      // Verificación de Mantenimiento
      const maintenanceList = readMaintenanceDb();
      if (maintenanceList.includes(commandName) && !isOwner) {
        return sock.sendMessage(from, { text: "🛠️ Este comando está actualmente en mantenimiento. Por favor, inténtalo más tarde." });
      }

      // Ejecución
      try {
        await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY_MS));
  await command.execute({ sock, msg, args, commands, config, testCache, isOwner, commandName });
        cooldowns.set(senderId, Date.now());
      } catch (error) {
        console.error(`Error en comando ${commandName}:`, error);
        await sock.sendMessage(from, { text: 'Ocurrió un error al ejecutar ese comando.' });
      }
    }
  } catch (e) {
    console.error("Error en el manejador de mensajes:", e);
  }
}
