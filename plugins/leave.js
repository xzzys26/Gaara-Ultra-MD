const leaveCommand = {
  name: "leave",
  category: "propietario",
  description: "Hace que el bot se salga del grupo actual.",

  async execute({ sock, msg, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];
    const from = msg.key.remoteJid;

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(from, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en un grupo." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(from, { text: "Entendido. Me saldré del grupo. ¡Hasta luego!" });
      await sock.groupLeave(from);
    } catch (e) {
      console.error("Error en el comando leave:", e);
      await sock.sendMessage(senderId, { text: "Ocurrió un error al intentar salir del grupo." });
    }
  }
};

export default leaveCommand;
