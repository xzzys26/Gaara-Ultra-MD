const lidCommand = {
  name: "lid",
  category: "utilidades",
  description: "Muestra tus identificadores de WhatsApp para diagnóstico.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // Este es el ID que el bot recibe en un grupo. Puede ser un LID o un JID.
    const participantId = isGroup ? msg.key.participant : "N/A (solo en grupos)";

    // Este es el ID del chat. Si es un chat privado, es el JID del usuario.
    const remoteJid = msg.key.remoteJid;

    const message = `
╭━━━〔 *-- Tus Identificadores --* 〕━━━╮

➺ Para que te reconozca como dueño en un grupo, necesito el siguiente ID:

➺ *ID de Participante (LID o JID):*
\`${participantId}\`

➺ *ID del Chat:*
\`${remoteJid}\`

╰━━━〔 *🛠 Gaara Ultra MD 🛠* 〕━━━╯
`;

    await sock.sendMessage(from, { text: message }, { quoted: msg });
  }
};

export default lidCommand;
