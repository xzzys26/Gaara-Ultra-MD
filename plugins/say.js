const sayCommand = {
  name: "say",
  category: "juegos",
  description: "Hace que el bot repita tu mensaje.",

  async execute({ sock, msg, args }) {
    const textToSay = args.join(' ');
    if (!textToSay) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Escribe algo para que yo lo repita. Ejemplo: `say Hola mundo`" }, { quoted: msg });
    }

    await sock.sendMessage(msg.key.remoteJid, { text: textToSay });
  }
};

export default sayCommand;
