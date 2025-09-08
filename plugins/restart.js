const restartCommand = {
  name: "restart",
  category: "propietario",
  description: "Reinicia el bot. (Solo para el propietario)",

  async execute({ sock, msg, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: "Reiniciando el bot..." }, { quoted: msg });
      process.exit(0);
    } catch (error) {
      console.error("Error al intentar reiniciar:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al intentar reiniciar." }, { quoted: msg });
    }
  }
};

export default restartCommand;
