const hidetagCommand = {
  name: "hidetag",
  category: "grupos",
  description: "Etiqueta a todos los miembros de un grupo.",
  aliases: ["invocar", "tag"],

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const senderIsAdmin = metadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
      if (!senderIsAdmin) {
        return sock.sendMessage(from, { text: "No tienes permisos de administrador." }, { quoted: msg });
      }

      const participants = metadata.participants.map(p => p.id);
      const messageText = args.join(' ') || "¡Atención a todos!";

      await sock.sendMessage(from, {
        text: messageText,
        mentions: participants
      });

    } catch (e) {
      console.error("Error en el comando hidetag:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al intentar etiquetar a todos." }, { quoted: msg });
    }
  }
};

export default hidetagCommand;
