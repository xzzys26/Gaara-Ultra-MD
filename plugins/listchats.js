const listChatsCommand = {
  name: "listchats",
  category: "propietario",
  description: "Muestra una lista de todos los grupos en los que está el bot.",

  async execute({ sock, msg, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);

      if (groupIds.length === 0) {
        return sock.sendMessage(senderId, { text: "No estoy en ningún grupo." });
      }

      let message = `*Estoy en ${groupIds.length} grupos:*\n\n`;
      for (const id of groupIds) {
        const group = groups[id];
        message += `*• Nombre:* ${group.subject}\n`;
        message += `*  ID:* \`${group.id}\`\n\n`;
      }

      await sock.sendMessage(senderId, { text: message });

    } catch (e) {
      console.error("Error en el comando listchats:", e);
      await sock.sendMessage(senderId, { text: "Ocurrió un error al obtener la lista de grupos." });
    }
  }
};

export default listChatsCommand;
