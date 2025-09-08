const joinCommand = {
  name: "join",
  category: "general",
  description: "Solicita que el bot se una a un grupo de WhatsApp.",

  async execute({ sock, msg, args, config }) {
    const link = args[0];
    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/;
    const match = link?.match(linkRegex);

    if (!match) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un enlace de invitación de WhatsApp válido." }, { quoted: msg });
    }

    const senderName = msg.pushName || msg.sender.split('@')[0];
    const requestMessage = `🚨 *Solicitud para Unirse a Grupo* 🚨\n\n` +
                           `*De:* ${senderName} (${msg.sender})\n` +
                           `*Enlace:* ${link}\n\n` +
                           `Para aceptar, usa el comando \`.joingroup ${link}\``;

    try {
      // Enviar la solicitud a cada propietario
      for (const owner of config.ownerNumbers) {
        // Asegurarse de que el número de owner tenga el formato correcto de JID
        const ownerJid = owner.endsWith('@s.whatsapp.net') ? owner : `${owner}@s.whatsapp.net`;
        await sock.sendMessage(ownerJid, { text: requestMessage });
      }

      // Confirmar al usuario que la solicitud fue enviada
      await sock.sendMessage(msg.key.remoteJid, { text: "✅ Tu solicitud ha sido enviada al propietario del bot para su aprobación." }, { quoted: msg });

    } catch (error) {
      console.error("Error en el comando join:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al enviar tu solicitud al propietario." }, { quoted: msg });
    }
  }
};

export default joinCommand;
