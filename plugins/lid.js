const lidCommand = {
  name: "lid",
  category: "utilidades",
  description: "Muestra tus IDs de WhatsApp (LID o JID) con detalles.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // Enviar mensaje temporal tipo loader
    const loader = await sock.sendMessage(from, { text: "⏳ Identificando, un momento..." }, { quoted: msg });

    // ID de participante (solo en grupos)
    const participantId = isGroup ? msg.key.participant : "⚠️ Disponible solo en grupos";

    // ID del chat (grupo o privado)
    const remoteJid = msg.key.remoteJid;

    // Tipo de ID del chat
    const chatType = remoteJid.includes(":") ? "🔑 LID" : "🆔 JID";

    // Tipo de ID del participante
    const participantType = isGroup
      ? (participantId.includes(":") ? "🔑 LID" : "🆔 JID")
      : "⚠️ No aplica";

    const result = `
📌 *Resultado de Identificación*

👥 Chat ID: 
${remoteJid}
→ Tipo: ${chatType}

🙋 Participante ID: 
${participantId}
→ Tipo: ${participantType}

✅ Listo, ya tienes tus identificadores.
    `;

    // Edita el mensaje del loader con el resultado final
    await sock.sendMessage(from, { text: result.trim(), edit: loader.key });
  }
};

export default lidCommand;