import { readSettingsDb, writeSettingsDb } from '../lib/database.js';

const welcomeCommand = {
  name: "welcome",
  category: "grupos",
  description: "Activa o desactiva los mensajes de bienvenida/despedida.",

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;
    const option = args[0]?.toLowerCase();

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

    if (option !== 'on' && option !== 'off') {
      return sock.sendMessage(from, { text: "Usa `welcome on` o `welcome off`." }, { quoted: msg });
    }

    const settings = readSettingsDb();
    if (!settings[from]) {
      settings[from] = {}; // Crear objeto de ajustes para el grupo si no existe
    }

    if (option === 'on') {
      settings[from].welcome = true;
      await sock.sendMessage(from, { text: "✅ Mensajes de bienvenida activados." }, { quoted: msg });
    } else { // option === 'off'
      settings[from].welcome = false;
      await sock.sendMessage(from, { text: "❌ Mensajes de bienvenida desactivados." }, { quoted: msg });
    }

    writeSettingsDb(settings);
  }
};

export default welcomeCommand;
