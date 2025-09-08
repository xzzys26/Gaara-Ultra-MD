const grupoCommand = {
  name: "grupo",
  category: "grupos",
  description: "Comandos relacionados con la administración de grupos.",

  async execute({ sock, msg }) {
    // Esta es una base para futuros comandos de grupo.
    // Ejemplo: obtener info del grupo.
    const from = msg.key.remoteJid;
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: "Este comando solo puede usarse en grupos." }, { quoted: msg });
      return;
    }

    try {
      const metadata = await sock.groupMetadata(from);
      let infoText = `*Nombre del Grupo:* ${metadata.subject}\n`;
      infoText += `*ID:* ${metadata.id}\n`;
      infoText += `*Participantes:* ${metadata.participants.length}`;

      await sock.sendMessage(from, { text: infoText }, { quoted: msg });

    } catch (error) {
      console.error("Error al obtener metadatos del grupo:", error);
      await sock.sendMessage(from, { text: "Ocurrió un error al obtener la información del grupo." }, { quoted: msg });
    }
  }
};

export default grupoCommand;
