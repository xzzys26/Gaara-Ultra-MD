import { readSettingsDb, writeSettingsDb } from '../lib/database.js';

const onWelcomeCommand = {
  name: ".on",
  category: "grupos",
  description: "Activa configuraciones (ej: `.on welcome`) en el grupo.",

  async execute({ sock, msg, args = [] }) {
    const from = msg.key.remoteJid;
    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }
    // Debe indicar qué activar: `.on welcome`
    const what = (args[0] || '').toLowerCase();
    if (!what) return sock.sendMessage(from, { text: "Indica qué activar. Ejemplo: `.on welcome`" }, { quoted: msg });
    if (what !== 'welcome') return sock.sendMessage(from, { text: "Opción no válida. Actualmente soportado: `welcome`" }, { quoted: msg });
    try {
      const metadata = await sock.groupMetadata(from);
      const senderId = msg.key.participant || msg.key.remoteJid;
      const participant = metadata.participants.find(p => p.id === senderId);
      if (!participant || !['admin', 'superadmin'].includes(participant.admin)) {
        return sock.sendMessage(from, { text: "No tienes permisos de administrador para usar este comando." }, { quoted: msg });
      }
    } catch (e) {
      return sock.sendMessage(from, { text: "Ocurrió un error al verificar tus permisos." }, { quoted: msg });
    }
    const settings = readSettingsDb();
    if (!settings[from]) settings[from] = {};
    settings[from].welcome = true;
    writeSettingsDb(settings);
    await sock.sendMessage(from, { text: "✅ Mensajes de bienvenida ACTIVADOS para este grupo." }, { quoted: msg });
  }
};

export default onWelcomeCommand;
