// antilink Actualizado by xzzys26 

const antiLinkRegex = /(https?:\/\/[^\s]+)/i; // Detecta cualquier link

const antilinkCommand = {
  name: "antilink",
  category: "grupo",
  description: "Detecta enlaces de cualquier tipo y evita que se compartan en el grupo.",

  async execute({ sock, msg }) {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      // Solo grupos
      if (!from.endsWith("@g.us")) return;

      // Obtener texto del mensaje
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      if (!text) return;

      // Revisar si hay algún link
      if (antiLinkRegex.test(text)) {
        // Aviso al usuario primero
        await sock.sendMessage(
          from,
          { text: `⚠️ @${sender.split("@")[0]}, no se permiten enlaces aquí! Por favor, elimina el mensaje.` },
          { quoted: msg, mentions: [sender] }
        );

        // Opcional: Esperar unos segundos antes de expulsar (para dar chance de borrar)
        setTimeout(async () => {
          try {
            // Revisar si el mensaje sigue ahí antes de expulsar
            // Aquí podrías agregar lógica más avanzada para revisar mensajes recientes si quieres
            await sock.groupParticipantsUpdate(from, [sender], "remove");
            await sock.sendMessage(from, { text: `🚫 @${sender.split("@")[0]} ha sido expulsado por enviar enlaces.` }, { mentions: [sender] });
          } catch (err) {
            console.error("Error expulsando usuario en antilink:", err);
          }
        }, 5000); // Espera 5 segundos
      }
    } catch (err) {
      console.error("Error en plugin antilink:", err);
    }
  }
};

export default antilinkCommand;