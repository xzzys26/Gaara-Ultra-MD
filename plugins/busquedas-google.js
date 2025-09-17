// créditos github.com/BrayanOFC no quitar creditos
import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('⚡️ Ingresa lo que quieras buscar en Google\n\nEjemplo: .google quien es el personaje principal de Gaara');

  try {
    const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;
    let api = await fetch(apiUrl);
    let data = await api.json();

    if (!data || !data.result || data.result.length === 0) {
      return m.reply('❌ No encontré resultados en Google');
    }

    let results = `🔎 *Resultados de Google para:* ${text}\n\n`;

    for (let i = 0; i < Math.min(5, data.result.length); i++) {
      results += `📌 *${data.result[i].title}*\n🔗 ${data.result[i].link}\n\n`;
    }

    await conn.reply(m.chat, results.trim(), m);
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al buscar en Google');
  }
};

handler.help = ['google <texto>'];
handler.tags = ['buscador'];
handler.command = /^google$/i;

export default handler;