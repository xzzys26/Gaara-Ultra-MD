const ownerCommand = {
  name: "owner",
  category: "general",
  description: "Muestra el nombre del creador del bot.",

  async execute({ sock, msg, config }) {
    const ownerText = `El creador de este bot es *${config.ownerName}*.`;
    await sock.sendMessage(msg.key.remoteJid, { text: ownerText }, { quoted: msg });
  }
};

export default ownerCommand;
