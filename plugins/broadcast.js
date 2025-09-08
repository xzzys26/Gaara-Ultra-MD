const broadcastCommand = {
  name: "broadcast",
  category: "propietario",
  description: "Envía un mensaje a todos los grupos en los que está el bot.",
  aliases: ["bc"],

  async execute({ sock, msg, args, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    const messageToBroadcast = args.join(' ');
    if (!messageToBroadcast) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un mensaje para el broadcast." }, { quoted: msg });
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);

      await sock.sendMessage(msg.key.remoteJid, { text: `Iniciando broadcast a ${groupIds.length} grupos...` }, { quoted: msg });

      let successCount = 0;
      let errorCount = 0;

      for (const groupId of groupIds) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await sock.sendMessage(groupId, { text: `*-- MENSAJE DE BROADCAST --*\n\n${messageToBroadcast}` });
          successCount++;
        } catch (e) {
          console.error(`Error enviando broadcast al grupo ${groupId}:`, e);
          errorCount++;
        }
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `*Broadcast Finalizado*\n\n✅ Enviado a: ${successCount} grupos\n❌ Fallos en: ${errorCount} grupos` }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando broadcast:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al obtener la lista de grupos." }, { quoted: msg });
    }
  }
};

export default broadcastCommand;
