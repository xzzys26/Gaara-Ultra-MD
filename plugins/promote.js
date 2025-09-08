const promoteCommand = {
  name: "promote",
  category: "grupos",
  description: "Asciende a un miembro a administrador del grupo.",

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
      return;
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botIsAdmin = metadata.participants.find(p => p.id === botJid)?.admin;

      if (!botIsAdmin) {
        await sock.sendMessage(from, { text: "Necesito ser administrador del grupo para usar este comando." }, { quoted: msg });
        return;
      }

      const senderId = msg.key.participant || msg.key.remoteJid;
      const senderIsAdmin = metadata.participants.find(p => p.id === senderId)?.admin;

      if (!senderIsAdmin) {
        await sock.sendMessage(from, { text: "No tienes permisos de administrador para usar este comando." }, { quoted: msg });
        return;
      }

      let usersToPromote = [];
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        usersToPromote = msg.message.extendedTextMessage.contextInfo.mentionedJid;
      } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        usersToPromote.push(msg.message.extendedTextMessage.contextInfo.participant);
      }

      if (usersToPromote.length === 0) {
        await sock.sendMessage(from, { text: "Debes mencionar a un usuario o responder a su mensaje para promoverlo." }, { quoted: msg });
        return;
      }

      await sock.groupParticipantsUpdate(from, usersToPromote, "promote");
      await sock.sendMessage(from, { text: `✅ Se ha ascendido a administrador a ${usersToPromote.map(u => `@${u.split('@')[0]}`).join(' ')}.` }, { quoted: msg, mentions: usersToPromote });

    } catch (error) {
      console.error("Error en el comando promote:", error);
      await sock.sendMessage(from, { text: "Ocurrió un error al intentar promover al miembro." }, { quoted: msg });
    }
  }
};

export default promoteCommand;
