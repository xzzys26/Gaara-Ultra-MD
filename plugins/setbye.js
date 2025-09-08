import { readSettingsDb, writeSettingsDb } from '../lib/database.js';

const setByeCommand = {
  name: "setbye",
  category: "grupos",
  description: "Establece un mensaje de despedida para el grupo. Usa @user para mencionar al miembro que se fue. Escribe 'off' para desactivarlo.",

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;
    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    // Verificar si el usuario es administrador del grupo
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
    const byeText = args.join(' ');

    if (!settings[from]) {
      settings[from] = {};
    }

    if (byeText.toLowerCase() === 'off' || byeText.toLowerCase() === 'disable') {
      settings[from].bye = false;
      writeSettingsDb(settings);
      return sock.sendMessage(from, { text: "✅ Los mensajes de despedida han sido desactivados para este grupo." }, { quoted: msg });
    }

    if (!byeText) {
        return sock.sendMessage(from, { text: "Por favor, proporciona un mensaje de despedida. Ejemplo: `setbye Adiós, @user.`" }, { quoted: msg });
    }

    settings[from].bye = true;
    settings[from].byeMessage = byeText;
    writeSettingsDb(settings);

    await sock.sendMessage(from, { text: `✅ Mensaje de despedida establecido:\n\n"${byeText}"` }, { quoted: msg });
  }
};

export default setByeCommand;
