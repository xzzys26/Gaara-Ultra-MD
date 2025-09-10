const lidCommand = {
  name: "lid",
  category: "utilidades",
  description: "Muestra tus IDs de WhatsApp (LID o JID) con detalles.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // Primer mensaje loader
    const loader = await sock.sendMessage(from, { text: "⏳ 𝙄𝙣𝙙𝙚𝙣𝙩𝙞𝙛𝙞𝙘𝙖𝙣𝙙𝙤 𝙐𝙣 𝙈𝙤𝙢𝙚𝙣𝙩𝙤..." }, { quoted: msg });

    // Etapa 2: actualizar loader
    setTimeout(async () => {
      await sock.sendMessage(from, { text: "🔍 𝘽𝙪𝙨𝙘𝙖𝙣𝙙𝙤 𝘿𝙖𝙩𝙤𝙨...", edit: loader.key });
    }, 1500);

    // Etapa 3: mostrar "resultados encontrados"
    setTimeout(async () => {
      // ID de participante (solo en grupos)
      const participantId = isGroup ? msg.key.participant : "⚠️ Disponible solo en grupos";

      // ID del chat (grupo o privado)
      const remoteJid = msg.key.remoteJid;

      // Tipo de ID del chat (basado en si contiene ":")
      const chatType = remoteJid.includes(":") ? "🔑 LID" : "🆔 JID";

      // Tipo de grupo (solo si es grupo)
      const groupType = isGroup
        ? (remoteJid.includes(":") ? "👥 Grupo LID" : "👥 Grupo JID")
        : "💬 No es un grupo";

      // Tipo de ID del participante (basado en su sufijo)
      let participantType = "⚠️ No aplica";
      if (isGroup) {
        if (participantId.endsWith("@lid")) {
          participantType = "🔑 LID";
        } else if (participantId.endsWith("@s.whatsapp.net")) {
          participantType = "🆔 JID";
        } else {
          participantType = "❓ Desconocido";
        }
      }

      const result = `
📊 *Resultados encontrados*

${groupType}

👥 Chat ID: 
${remoteJid}
→ Tipo: ${chatType}

🙋 Participante ID: 
${participantId}
→ Tipo: ${participantType}

✅ Listo, ya tienes tus identificadores.

> ʙᴜsǫᴜᴅᴀ ʙʏ ɢᴀᴀʀᴀ ᴜʟᴛʀᴀ-ᴍᴅ 🌀
      `;

      await sock.sendMessage(from, { text: result.trim(), edit: loader.key });
    }, 3000);
  }
};

export default lidCommand;