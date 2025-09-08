const kickCommand = {
  name: "kick",
  category: "grupos",
  description: "Elimina a un miembro del grupo.",

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

      let usersToKick = [];
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        usersToKick = msg.message.extendedTextMessage.contextInfo.mentionedJid;
      } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        usersToKick.push(msg.message.extendedTextMessage.contextInfo.participant);
      }

      if (usersToKick.length === 0) {
        await sock.sendMessage(from, { text: "Debes mencionar a un usuario o responder a su mensaje para eliminarlo." }, { quoted: msg });
        return;
      }

      const groupOwner = metadata.owner;
      const selfKick = usersToKick.find(u => u === botJid);
      if (selfKick) {
        await sock.sendMessage(from, { text: "No puedo eliminarme a mí mismo." }, { quoted: msg });
        return;
      }
      const ownerKick = usersToKick.find(u => u === groupOwner);
      if (ownerKick) {
         await sock.sendMessage(from, { text: "No se puede eliminar al propietario del grupo." }, { quoted: msg });
        return;
      }

      await sock.groupParticipantsUpdate(from, usersToKick, "remove");
      await sock.sendMessage(from, { text: `✅ Se ha eliminado a ${usersToKick.map(u => `@${u.split('@')[0]}`).join(' ')} del grupo.` }, { quoted: msg, mentions: usersToKick });

    } catch (error) {
      console.error("Error en el comando kick:", error);
      await sock.sendMessage(from, { text: "Ocurrió un error al intentar eliminar al miembro. Es posible que sea administrador." }, { quoted: msg });
    }
  }
};

export default kickCommand;
