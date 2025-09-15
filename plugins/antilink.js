// antilink ultra completo compatible con Gaara-Ultra-MD by xzzys26

const antiLinkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|instagram\.com\/[^\s]+|facebook\.com\/[^\s]+|twitter\.com\/[^\s]+|youtube\.com\/[^\s]+|tiktok\.com\/[^\s]+|pinterest\.com\/[^\s]+)/i;

const antilinkCommand = {
  name: "antilink",
  category: "grupo",
  description: "Detecta cualquier enlace de redes, canales o grupos y expulsa al usuario.",

  async execute({ sock, msg }) {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      if (!from.endsWith("@g.us")) return; // solo grupos

      // Obtener texto de cualquier tipo de mensaje
      let text = '';
      if (msg.message?.conversation) text = msg.message.conversation;
      else if (msg.message?.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
      else if (msg.message?.imageMessage?.caption) text = msg.message.imageMessage.caption;
      else if (msg.message?.videoMessage?.caption) text = msg.message.videoMessage.caption;
      else if (msg.message?.documentMessage?.caption) text = msg.message.documentMessage.caption;
      else if (msg.message?.buttonsResponseMessage?.selectedButtonId) text = msg.message.buttonsResponseMessage.selectedButtonId;
      else if (msg.message?.templateButtonReplyMessage?.selectedId) text = msg.message.templateButtonReplyMessage.selectedId;

      if (!text) return;

      // Detectar enlaces
      if (antiLinkRegex.test(text)) {
        // Borrar el mensaje
        try {
          await sock.sendMessage(from, { delete: msg.key });
        } catch (err) {
          console.error("No se pudo borrar el mensaje:", err);
        }

        // Expulsar al usuario (solo si bot es admin)
        try {
          await sock.groupParticipantsUpdate(from, [sender], "remove");
        } catch (err) {
          console.error("No se pudo expulsar al usuario. Asegúrate que el bot sea admin.", err);
        }

        // Aviso al grupo
        await sock.sendMessage(
          from,
          { text: `🚫 @${sender.split("@")[0]} ha sido expulsado por enviar enlaces no permitidos.` },
          { mentions: [sender] }
        );
      }

    } catch (err) {
      console.error("Error en antilink:", err);
    }
  }
};

export default antilinkCommand;