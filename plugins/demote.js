const demoteCommand = {
  name: "demote",
  category: "grupos",
  description: "Degrada a un administrador a miembro común.",

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

      let usersToDemote = [];
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        usersToDemote = msg.message.extendedTextMessage.contextInfo.mentionedJid;
      } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        usersToDemote.push(msg.message.extendedTextMessage.contextInfo.participant);
      }

      if (usersToDemote.length === 0) {
        await sock.sendMessage(from, { text: "Debes mencionar a un administrador o responder a su mensaje para degradarlo." }, { quoted: msg });
        return;
      }

      await sock.groupParticipantsUpdate(from, usersToDemote, "demote");
      await sock.sendMessage(from, { text: `✅ Se ha degradado a miembro a ${usersToDemote.map(u => `@${u.split('@')[0]}`).join(' ')}.` }, { quoted: msg, mentions: usersToDemote });

    } catch (error) {
      console.error("Error en el comando demote:", error);
      await sock.sendMessage(from, { text: "Ocurrió un error al intentar degradar al administrador." }, { quoted: msg });
    }
  }
};

export default demoteCommand;
