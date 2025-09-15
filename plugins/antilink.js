// antilink avanzado Gaara-Ultra-MD by xzzys26

// Regex para la mayoría de enlaces comunes
const antiLinkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+)/i;

const antilinkCommand = {
  name: "antilink",
  category: "grupo",
  description: "Detecta y elimina enlaces automáticamente y expulsa al usuario del grupo.",

  async execute({ sock, msg }) {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      // Solo grupos
      if (!from.endsWith("@g.us")) return;

      // Función para obtener texto de cualquier tipo de mensaje
      const getMessageText = (msg) => {
        return (
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          msg.message?.videoMessage?.caption ||
          msg.message?.documentMessage?.caption ||
          msg.message?.templateButtonReplyMessage?.selectedId ||
          msg.message?.buttonsResponseMessage?.selectedButtonId ||
          ''
        );
      };

      const text = getMessageText(msg);
      if (!text) return;

      // Detecta enlaces
      if (antiLinkRegex.test(text)) {
        // Borra el mensaje
        await sock.sendMessage(from, { delete: msg.key });

        // Expulsa al usuario inmediatamente
        await sock.groupParticipantsUpdate(from, [sender], "remove");

        // Mensaje de aviso al grupo
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