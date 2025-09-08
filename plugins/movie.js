const movieCommand = {
  name: "movie",
  category: "informacion",
  description: "Busca información sobre una película. (En desarrollo)",

  async execute({ sock, msg, args }) {
    const title = args.join(' ');
    if (!title) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona el título de una película." }, { quoted: msg });
    }
    await sock.sendMessage(msg.key.remoteJid, { text: `El comando para buscar información de películas está en desarrollo. No se puede buscar *${title}* en este momento.` }, { quoted: msg });
  }
};

export default movieCommand;
