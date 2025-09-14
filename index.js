import { Boom } from '@hapi/boom';
import Baileys, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  Browsers,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcodeTerminal from 'qrcode-terminal';
import chalk from 'chalk';
import readline from 'readline';
import pkgPhone from 'google-libphonenumber';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import axios from 'axios';
import os from 'os';
import cfonts from 'cfonts';

try {
  const { say } = cfonts;
  const botDisplayName = (config && (config.botName || config.name || global.namebot)) || 'Bot';
  console.log(chalk.magentaBright(`\n💫 Iniciando ${botDisplayName}...`));
  say('Gaara Ai', { font: 'simple', align: 'left', gradient: ['green','white'] });
  say('Gaara Team', { font: 'console', align: 'center', colors: ['cyan','magenta','yellow'] });
  try { (global.protoType && typeof global.protoType === 'function') && global.protoType(); } catch {}
  try { (global.serialize && typeof global.serialize === 'function') && global.serialize(); } catch {}
  const __pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'package.json');
  let packageJsonObj = {};
  try { const rawPkg = fs.readFileSync(__pkgPath, 'utf8'); packageJsonObj = JSON.parse(rawPkg); } catch {}
  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  const currentTime = new Date().toLocaleString();
  const info = `\n╭─────────────────────────────◉\n│ ${chalk.red.bgBlueBright.bold('        🖥 INFORMACIÓN DEL SISTEMA        ')}\n│「 💻 」${chalk.yellow(`SO: ${os.type()}, ${os.release()} - ${os.arch()}`)}\n│「 💾 」${chalk.yellow(`RAM Total: ${ramInGB.toFixed(2)} GB`)}\n│「 💽 」${chalk.yellow(`RAM Libre: ${freeRamInGB.toFixed(2)} GB`)}\n╰─────────────────────────────◉\n\n╭─────────────────────────────◉\n│ ${chalk.red.bgGreenBright.bold('        🟢 INFORMACIÓN DEL BOT        ')}\n│「 🎈 」${chalk.cyan(`Nombre: ${packageJsonObj.name || 'desconocido'}`)}\n│「 🍒 」${chalk.cyan(`Versión: ${packageJsonObj.version || '0.0.0'}`)}\n│「 🍉 」${chalk.cyan(`Descripción: ${packageJsonObj.description || ''}`)}\n│「 ☂️ 」${chalk.cyan(`Autor: ${(packageJsonObj.author && packageJsonObj.author.name) ? packageJsonObj.author.name : (packageJsonObj.author || 'N/A')} (@Gaara)`)}\n│「 🐢 」${chalk.cyan('Colaborador: David')}\n╰─────────────────────────────◉\n\n╭─────────────────────────────◉\n│ ${chalk.red.bgMagenta.bold('        ⏰ HORA ACTUAL        ')}\n│「 🕒 」${chalk.magenta(`${currentTime}`)}\n╰─────────────────────────────◉\n`;
  console.log(info);
} catch (e) {
  console.log('[Banner] Error al mostrar banners:', e?.message || e);
}

// --- CONFIGURACIÓN GLOBAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseLogger = pino({ level: 'warn' });
function shouldSkipBaileysLog(args) {
  try {
    if (!args || !args.length) return false;
    const matchStr = (s) => typeof s === 'string' && (
      // benign or noisy messages
      s.includes('failed to obtain extra info') ||
      s.includes('No image processing library available') ||
      // recurrent decrypt noise from Baileys/libsignal
      s.toLowerCase().includes('failed to decrypt message') ||
      s.toLowerCase().includes('no session record') ||
      s.toLowerCase().includes('sessionerror') ||
      s.toLowerCase().includes('message keys not found')
    );
    for (const a of args) {
      if (matchStr(a)) return true;
      if (a && typeof a === 'object') {
        const msg = a.msg || a.message || '';
        const trace = a.trace || a.stack || '';
        // common nested error payload in Baileys logs
        const errMsg = a.err?.message || '';
        const errStack = a.err?.stack || '';
        const errName = a.err?.name || '';
        if (matchStr(msg) || matchStr(trace) || matchStr(errMsg) || matchStr(errStack) || matchStr(errName)) return true;
      }
    }
    return false;
  } catch { return false; }
}

function wrapLogger(lg) {
  const wrapper = {
    level: lg.level,
    // standard methods
    fatal: (...args) => lg.fatal?.(...args),
    error: (...args) => { if (!shouldSkipBaileysLog(args)) return lg.error?.(...args); },
    warn:  (...args) => { if (!shouldSkipBaileysLog(args)) return lg.warn?.(...args); },
    info: (...args) => lg.info?.(...args),
    debug: (...args) => lg.debug?.(...args),
    trace: (...args) => lg.trace?.(...args),
    child: (...cargs) => wrapLogger(lg.child?.(...cargs) || lg)
  };
  return wrapper;
}
const logger = wrapLogger(baseLogger);
// Opciones globales para utilidades (ej. vista previa de imágenes en consola)
global.opts = global.opts || {};

// --- COLECCIONES GLOBALES ---
export const commands = new Map();
export const aliases = new Map();
export const testCache = new Map();
export const cooldowns = new Map();
// El nuevo sistema de sub-bots usará global.conns
// export const subBots = new Map();

// --- CONFIGURACIÓN DE TIEMPOS ---
const COOLDOWN_SECONDS = 5;
const RESPONSE_DELAY_MS = 2000;

// --- FUNCIÓN PARA CARGAR COMANDOS ---
export async function loadCommands() {
  // Limpiar mapas antes de cargar para permitir la recarga
  commands.clear();
  aliases.clear();

  const pluginsDir = path.join(__dirname, 'plugins');
  try {
    const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    for (const file of files) {
      try {
        const commandModule = await import(path.join('file://', pluginsDir, file));
        const command = commandModule.default;
        if (command && command.name) {
          commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => aliases.set(alias, command.name));
          }
        }
      } catch (error) { console.error(`[-] Error al cargar ${file}:`, error); }
    }
    console.log(`[+] ${commands.size} comandos y ${aliases.size} alias cargados.`);
  } catch (error) { console.error(`[-] No se pudo leer la carpeta de plugins:`, error); }
}

// --- FUNCIÓN DE INICIO DEL BOT PRINCIPAL ---
async function connectToWhatsApp() {
  // Permitir carpeta de autenticación configurable y migrar si es necesario
  const authDir = config.authDir || 'auth_info_baileys';
  const oldAuthDir = 'auth_info_baileys';
  const absAuthDir = path.resolve(__dirname, authDir);
  const absOldAuthDir = path.resolve(__dirname, oldAuthDir);

  try {
    const existsOld = fs.existsSync(absOldAuthDir);
    const existsNew = fs.existsSync(absAuthDir);
    const isEmpty = (dir) => {
      try {
        return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0;
      } catch { return false; }
    };

    if (authDir !== oldAuthDir && existsOld) {
      if (!existsNew) {
        fs.renameSync(absOldAuthDir, absAuthDir);
        console.log(`[migración] Carpeta de sesión movida: ${oldAuthDir} -> ${authDir}`);
      } else if (isEmpty(absAuthDir)) {
        // mover contenido de la vieja a la nueva si la nueva está vacía
        for (const f of fs.readdirSync(absOldAuthDir)) {
          fs.renameSync(path.join(absOldAuthDir, f), path.join(absAuthDir, f));
        }
        console.log(`[migración] Contenido de ${oldAuthDir} fusionado en ${authDir}`);
        // eliminar la carpeta vieja por política de una sola carpeta
        try { fs.rmSync(absOldAuthDir, { recursive: true, force: true }); } catch {}
        console.log(`[limpieza] Carpeta antigua eliminada: ${oldAuthDir}`);
      } else {
        // mantener solo la nueva por política de una sola carpeta
        try { fs.rmSync(absOldAuthDir, { recursive: true, force: true });
          console.log(`[limpieza] Se detectaron ambas carpetas. Eliminada la antigua: ${oldAuthDir}`);
        } catch (e) {
          console.warn(`[migración] No se pudo eliminar la carpeta antigua ${oldAuthDir}:`, e?.message || e);
        }
      }
    }
  } catch (e) {
    console.warn('[migración] No se pudo mover la carpeta de sesión automáticamente:', e?.message || e);
  }

  console.log(`[auth] Usando carpeta de sesión: ${authDir}\n       Ruta absoluta: ${absAuthDir}`);
  const { state, saveCreds } = await useMultiFileAuthState(absAuthDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Usando Baileys v${version.join('.')}, ¿es la última versión?: ${isLatest}`);

  function existingSessionOnDisk() {
    try {
      const credsPath = path.join(absAuthDir, 'creds.json');
      if (fs.existsSync(credsPath)) {
        const raw = fs.readFileSync(credsPath, 'utf8');
        const data = JSON.parse(raw);
        if (data?.registered || data?.noiseKey) return true;
      }
    } catch {}
    return false;
  }
  // --- Selección de método estilo referencia ---
  const PhoneNumberUtil = pkgPhone.PhoneNumberUtil;
  const phoneUtil = PhoneNumberUtil.getInstance();
  async function isValidPhoneNumber(number) {
    try {
      let n = number.replace(/\s+/g, '');
      // Normalización México (+52) elimina 521 y +52 1 variantes comunes
      if (n.startsWith('+521')) n = n.replace('+521', '+52');
      if (n.startsWith('+52') && n[3] === '1') n = '+52' + n.slice(4);
      const parsed = phoneUtil.parseAndKeepRawInput(n);
      return phoneUtil.isValidNumber(parsed);
    } catch { return false; }
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(res => rl.question(q, ans => res(ans.trim())));
  let option = null; // '1'=QR '2'=CODE
  let phoneNumber = null;
  const argsQR = process.argv.includes('qr');
  const argsCode = process.argv.includes('code');

  if (!state?.creds?.registered && !existingSessionOnDisk()) {
    if (argsQR) option = '1';
    if (!argsQR && !argsCode) {
      do {
        option = await ask(chalk.bgMagenta.white('⌨ Selecciona una opción:\n') + chalk.bold.green('1. Código QR\n') + chalk.bold.cyan('2. Código de 8 dígitos\n--> '));
        if (!/^[1-2]$/.test(option)) console.log(chalk.red('Ingresa 1 o 2.'));
      } while (!['1','2'].includes(option));
    }
    if (argsCode) option = '2';
    if (option === '2') {
      // pedir número si no vino por argumento ENV
      let valid = false;
      while (!valid) {
  phoneNumber = await ask(chalk.green('Ingresa tu número con código de país (ej +57300xxxxxxx): '));
  phoneNumber = phoneNumber.replace(/\s+/g, '');
  if (!phoneNumber.startsWith('+')) phoneNumber = '+' + phoneNumber.replace(/[^\d]/g,'');
  valid = await isValidPhoneNumber(phoneNumber);
  if (!valid) console.log(chalk.red('Número inválido o formato no reconocido, intenta nuevamente.'));
      }
    }
    rl.close();
  } else {
    console.log(chalk.gray('[auth] Sesión existente: no se muestra menú.'));
  }

  const usingCode = option === '2';
  const sock = Baileys.default({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    logger,
    // Cambiamos fingerprint para pairing code a Safari macOS (algunos dispositivos aceptan mejor)
    browser: usingCode ? Browsers.macOS('Safari') : ['GaaraUltraMD', 'Chrome', '1.0.0'],
    printQRInTerminal: option === '1',
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false
  });

  let pairingRequested = false;
  let pairingAttempts = 0;
  // Eliminamos regeneración automática para evitar invalidar el código mientras lo escribes en el teléfono.
  async function attemptRequestPairing(digits) {
    if (pairingRequested) return;
    pairingRequested = true;
  pairingAttempts++;
  console.log(chalk.cyan(` [code] Generando código (intento lógico #${pairingAttempts}) para número: ${digits}`));
    const waitForReady = async (timeoutMs = 15000) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (sock?.ws && sock.ws.readyState === 1 && sock?.authState?.creds?.noiseKey) return true;
        await new Promise(r => setTimeout(r, 250));
      }
      return false;
    };
    console.log(chalk.gray(' [code] Esperando socket listo para pedir código...'));
    const ready = await waitForReady();
    if (!ready) console.log(chalk.yellow(' [code] Socket no completamente listo, intentaré igual.'));
  async function requestPairingWithRetries(number, max = 5) {
      for (let attempt = 1; attempt <= max; attempt++) {
        try {
          console.log(chalk.gray(` [code] Solicitando código (intento ${attempt}/${max})...`));
      // delay mínimo antes de primer intento para asegurar handshake completo
      if (attempt === 1) await new Promise(r => setTimeout(r, 1500));
      const code = await sock.requestPairingCode(number);
          if (!code) throw new Error('Respuesta vacía');
          return code;
        } catch (err) {
          const msg = (err?.message || err+'').toLowerCase();
          console.log(chalk.red(` [code] Fallo intento ${attempt}: ${msg}`));
          if (/not-authorized|logged out/.test(msg)) {
            console.log(chalk.red(' [code] Servidor rechazó (not-authorized/logged out). Deteniendo.'));
            break;
          }
      if (/connection closed|timed out|econn|socket|abort|reset/i.test(msg) && attempt < max) {
            await new Promise(r => setTimeout(r, 1800));
            continue;
          }
          if (attempt === max) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      throw new Error('No se obtuvo código tras múltiples intentos');
    }
    try {
      let code = await requestPairingWithRetries(digits, 5);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      console.log(chalk.bold.white(chalk.bgMagenta('✧ CÓDIGO DE VINCULACIÓN ✧')), chalk.bold.white(code));
      console.log(chalk.gray('Código (sin guiones):'), chalk.white(code.replace(/-/g,'')));
      console.log(chalk.gray('En tu teléfono: WhatsApp > Dispositivos vinculados > Vincular un dispositivo > Introducir código.'));
      console.log(chalk.yellow('NO esperes a que salga otro código aquí; si generas uno nuevo invalida el anterior.'));
      console.log(chalk.cyan('Si en el teléfono dice "couldn\'t link device" / "no se pudo vincular":'));
      console.log(chalk.cyan('  1) Verifica internet del teléfono (WiFi estable).'));
      console.log(chalk.cyan('  2) Cierra la pantalla y vuelve a entrar a "Introducir código".'));
      console.log(chalk.cyan('  3) Presiona ENTER aquí para generar un nuevo código solo entonces.'));
      // Preparar regeneración manual
      const regenInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
      regenInterface.on('line', async () => {
        if (sock?.authState?.creds?.registered) {
          console.log(chalk.green(' [code] Ya está vinculado, no se necesita nuevo código.'));
          regenInterface.close();
          return;
        }
        console.log(chalk.yellow(' [code] Regenerando código bajo demanda...'));
        pairingRequested = false; // permitir nueva petición
        regenInterface.close();
        attemptRequestPairing(digits);
      });
    } catch (e) {
      console.log(chalk.red(' [code] Error definitivo solicitando código:'), e?.message || e);
      console.log(chalk.yellow('Tips:'));
      console.log(chalk.yellow('- Asegúrate de que el número tiene WhatsApp activo.'));
      console.log(chalk.yellow('- No abras otros dispositivos mientras intentas.'));
      console.log(chalk.yellow('- Elimina carpeta de sesión y reintenta (solo código).'));
      console.log(chalk.yellow('- Si persiste: usa QR temporalmente.'));
      pairingRequested = false; // permitir reintento manual si deseado
    }
  }

  if (usingCode && !state.creds.registered) {
    const digits = phoneNumber ? phoneNumber.replace(/\D/g,'') : null;
    if (!digits) {
      console.log(chalk.red('No se obtuvo un número válido para solicitar código.'));
    } else {
      attemptRequestPairing(digits);
    }
  }

  // Variables para control de QR manual si se eligió qr pero queremos refresco legible
  let showedFirstQR = false;
  let lastQR = null;

  // Adjuntar el handler principal al socket del bot principal
  // Esto es para alinear con la estructura que espera el nuevo código
  const mainHandler = await import('./handler.js');
  sock.handler = mainHandler.handler.bind(sock);


  // --- MANEJO DE EVENTOS DE CONEXIÓN ---
  sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update;
  if (qr && option === '1') {
      lastQR = qr;
      if (!showedFirstQR) {
        console.log(chalk.yellow('Escanea el QR (cambia cada ~30s)...'));
        showedFirstQR = true;
      } else {
        console.log(chalk.gray('QR actualizado.'));
      }
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (usingCode && !state.creds.registered && !pairingRequested) {
      const digits = phoneNumber ? phoneNumber.replace(/\D/g,'') : null;
      if (digits) attemptRequestPairing(digits);
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexión principal cerrada, reconectando...', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('            BOT PRINCIPAL CONECTADO');
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('creds.update', () => {
    try {
      if (sock?.authState?.creds?.registered) {
        console.log(chalk.green(' [code] Dispositivo registrado correctamente ✅'));
      } else {
        console.log(chalk.gray(' [code] creds.update (aún no registrado)...'));
      }
    } catch {}
  });

  // (Selección ya realizada antes de crear el socket si era necesario)

  // --- MANEJO DE MENSAJES ---
  // El nuevo sistema usa un handler.js, así que adjuntamos el nuestro.
  // La lógica de comandos se moverá a handler.js para ser reutilizable.
  sock.ev.on('messages.upsert', (m) => sock.handler(m, false)); // false porque este es el bot principal

  // --- MANEJO DE BIENVENIDA Y DESPEDIDA ---
  sock.ev.on('group-participants.update', async (event) => {
    const { id, participants, action } = event;
  const { readSettingsDb } = await import('./lib/database.js');
  const { sendWelcomeOrBye } = await import('./lib/welcome.js');
  const settings = readSettingsDb();
  const groupSettings = settings[id] || {};
  // valores por defecto: si no está configurado, habilitar welcome/bye
  const welcomeEnabled = (typeof groupSettings.welcome === 'boolean') ? groupSettings.welcome : true;
  const byeEnabled = (typeof groupSettings.bye === 'boolean') ? groupSettings.bye : true;
    for (const p of participants) {
      try {
        // participants may be strings (jid) or objects { id: jid }
        const participantId = (typeof p === 'string') ? p : (p?.id || p?.jid || null);
        if (!participantId) {
          console.warn('group-participants.update: participante sin id válido:', p);
          continue;
        }
        const userName = `@${String(participantId).split('@')[0]}`;

        // Log event for easier debugging
        console.log(`group-participants.update: action=${action} group=${id} participant=${participantId}`);

        if (action === 'add' && welcomeEnabled) {
          if (groupSettings.welcomeMessage) {
            await sock.sendMessage(id, { text: groupSettings.welcomeMessage.replace(/@user/g, userName), mentions: [participantId] });
          } else {
            await sendWelcomeOrBye(sock, { jid: id, userName, type: 'welcome', groupName: '', participant: participantId });
          }
        } else if (action === 'remove' && byeEnabled) {
          if (groupSettings.byeMessage) {
            await sock.sendMessage(id, { text: groupSettings.byeMessage.replace(/@user/g, userName), mentions: [participantId] });
          } else {
            await sendWelcomeOrBye(sock, { jid: id, userName, type: 'bye', groupName: '', participant: participantId });
          }
        }
      } catch (e) {
        console.error(`Error en group-participants.update para el participante ${JSON.stringify(p)}:`, e);
      }
    }
  });

  return sock;
}

// --- INICIO DEL BOT ---
(async () => {
  await loadCommands();
  await connectToWhatsApp();
})();

// --- FILTRO GLOBAL DE ERRORES NO MANEJADOS (solo para ruido de descifrado) ---
process.on('unhandledRejection', (reason) => {
  try {
    const msg = (reason && (reason.message || reason.msg || reason.toString())) || '';
    const stack = (reason && (reason.stack || reason.trace || '')) || '';
    const blob = `${msg}\n${stack}`.toLowerCase();
    if (
      blob.includes('failed to decrypt message') ||
      blob.includes('unsupported state or unable to authenticate data') ||
      blob.includes('no session record') ||
      blob.includes('sessionerror')
    ) {
      // Silenciar solo estos errores recurrentes de Baileys/libsignal
      return;
    }
  } catch {}
  // Para cualquier otro error, mantener la visibilidad
  console.error('UnhandledRejection:', reason);
});
