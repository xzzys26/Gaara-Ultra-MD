import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { PassThrough } from 'stream';

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❌ Ingresa el nombre del video a descargar.`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    const fileName = `${title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, '_').slice(0,50)}.mp3`;

    // Descargar audio y convertir a buffer
    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
    const bufferStream = new PassThrough();
    stream.pipe(bufferStream);

    await conn.sendMessage(m.chat, {
      audio: bufferStream,
      mimetype: 'audio/mpeg',
      fileName
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply(`Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ['ytmp3'];
handler.tags = ['descargas'];

export default handler;