import yts from 'yt-search';
import fetch from 'node-fetch';

async function apiJoseDev(url) {
  const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`;
  const res = await fetch(apiURL);
  const data = await res.json();

  if (!data.status || !data.res?.url) throw new Error('API JoseDev no devolvió datos válidos');
  return { url: data.res.url, title: data.res.title || 'Video sin título XD' }; 
}

async function ytdl(url) {
  return await apiJoseDev(url);
}

let handler = async (m, { conn, text, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {});
  const ctxWarn = (global.rcanalw || {});
  const ctxOk = (global.rcanalr || {});

  if (!text) {
    return conn.reply(m.chat, `
⚡️ Gaara-Ultra-MD - Descargar Video

📝 Uso:
• ${usedPrefix}play2 <nombre de la canción>

💡 Ejemplo:
• ${usedPrefix}play2 spy x family opening

🎯 Formato:
🎥 Video MP4 de alta calidad

🌟 ¡Disfruta tus videos con Gaara-Ultra-MD 
    `.trim(), m, ctxWarn);
  }

  try {
    await conn.reply(m.chat, '⚡️🎬 Gaara está buscando tu video...', m, ctxOk);

    const searchResults = await yts(text);
    if (!searchResults.videos.length) throw new Error('No se encontraron resultados');

    const video = searchResults.videos[0];
    const { url, title } = await ytdl(video.url);

    const caption = `
⚡️ Gaara Ultra-Descargas ⚡️
🏷 Título: *${title}*
⏳️ Duración: ${video.timestamp}
👑 Autor: ${video.author.name}
🔗 URL: ${video.url}

⚡️ ¡Disfruta tu video 
> 🌟 Gracias por elegirme para tus descargas 
`.trim();

    const buffer = await fetch(url).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption
    }, { quoted: m });

    //await conn.reply(m.chat, `✅ ¡Video descargado con éxito! Disfrútalo ⚡️`, m, ctxOk);

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, `❌ Error: ${e.message}`, m, ctxErr);
  }
};

handler.help = ['play2 <nombre>'];
handler.tags = ['descargas'];
handler.command = ['play2'];

export default handler;