import lyricsFinder from 'lyrics-finder';

const lyricsCommand = {
  name: "lyrics",
  category: "utilidades",
  description: "Busca la letra de una canción.",
  aliases: ["letra"],

  async execute({ sock, msg, args }) {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona el nombre de una canción y, opcionalmente, el artista." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: `Buscando la letra de "${query}"...` }, { quoted: msg });

      const lyrics = await lyricsFinder(query) || "No se encontró la letra.";

      // Dividir el mensaje si es muy largo
      const messages = lyrics.match(/[\s\S]{1,4000}/g) || [];

      for (const messagePart of messages) {
        await sock.sendMessage(msg.key.remoteJid, { text: messagePart }, { quoted: msg });
      }

    } catch (e) {
      console.error("Error en el comando lyrics:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "No se pudo encontrar la letra para esa canción." }, { quoted: msg });
    }
  }
};

export default lyricsCommand;
