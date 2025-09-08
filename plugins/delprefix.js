import { readSettingsDb, writeSettingsDb } from '../lib/database.js';

const delprefixCommand = {
  name: "delprefix",
  category: "grupos",
  description: "Elimina el prefijo de comandos configurado para este grupo.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const senderIsAdmin = metadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
      if (!senderIsAdmin) {
        return sock.sendMessage(from, { text: "No tienes permisos de administrador." }, { quoted: msg });
      }
    } catch (e) {
      return sock.sendMessage(from, { text: "Ocurrió un error al verificar tus permisos." }, { quoted: msg });
    }

    const settings = readSettingsDb();

    if (settings[from] && settings[from].prefix) {
      delete settings[from].prefix;
      writeSettingsDb(settings);
      await sock.sendMessage(from, { text: "✅ Prefijo eliminado. El bot ahora responderá a comandos sin prefijo en este grupo." }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: "Este grupo no tiene ningún prefijo configurado." }, { quoted: msg });
    }
  }
};

export default delprefixCommand;
