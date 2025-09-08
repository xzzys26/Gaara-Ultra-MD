const joingroupCommand = {
  name: "joingroup",
  category: "propietario",
  description: "Hace que el bot se una a un grupo mediante un enlace de invitación.",

  async execute({ sock, msg, args, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    const inviteLink = args[0];
    if (!inviteLink || !inviteLink.includes('chat.whatsapp.com')) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un enlace de invitación de WhatsApp válido." }, { quoted: msg });
    }

    try {
      const inviteCode = inviteLink.split('chat.whatsapp.com/')[1];
      if (!inviteCode) {
        return sock.sendMessage(msg.key.remoteJid, { text: "El enlace no parece tener un código de invitación válido." }, { quoted: msg });
      }

      await sock.groupAcceptInvite(inviteCode);
      await sock.sendMessage(msg.key.remoteJid, { text: "✅ Me he unido al grupo exitosamente." }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando join:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al intentar unirme al grupo. Es posible que el enlace haya expirado o que haya sido eliminado del grupo." }, { quoted: msg });
    }
  }
};

export default joingroupCommand;
