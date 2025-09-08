import axios from 'axios';

// --- Funciones de Scraping para TikTok ---

// Obtener token y cookies desde la web de tmate
async function obtenerTokenYCookie() {
  const res = await axios.get('https://tmate.cc/id', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const cookie = res.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  const tokenMatch = res.data.match(/<input[^>]+name="token"[^>]+value="([^"]+)"/i);
  const token = tokenMatch?.[1];
  if (!token) throw new Error('No se encontró el token de tmate.cc');
  return { token, cookie };
}

// Descargar video o imagen desde TikTok
async function descargarDeTikTok(urlTikTok) {
  const { token, cookie } = await obtenerTokenYCookie();
  const params = new URLSearchParams();
  params.append('url', urlTikTok);
  params.append('token', token);

  const res = await axios.post('https://tmate.cc/action', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://tmate.cc/id',
      'Origin': 'https://tmate.cc',
      'Cookie': cookie
    }
  });

  const html = res.data?.data;
  if (!html) throw new Error('La respuesta de tmate.cc no contenía datos.');

  const tituloMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const titulo = tituloMatch?.[1]?.replace(/<[^>]+>/g, '').trim() || 'Sin título';

  const coincidencias = [...html.matchAll(/<a[^>]+href="(https:\/\/[^"]+)"[^>]*>\s*<span>\s*<span>([^<]*)<\/span><\/span><\/a>/gi)];
  const vistos = new Set();
  const enlaces = coincidencias
    .map(([_, href, etiqueta]) => ({ href, label: etiqueta.trim() }))
    .filter(({ href }) => !href.includes('play.google.com') && !vistos.has(href) && vistos.add(href));

  const enlacesMp4 = enlaces.filter(v => /download without watermark/i.test(v.label));
  const enlaceMp3 = enlaces.find(v => /download mp3 audio/i.test(v.label));

  if (enlacesMp4.length > 0) {
    return { type: 'video', title: titulo, mp4Links: enlacesMp4, mp3Link: enlaceMp3 };
  }

  const coincidenciasImg = [...html.matchAll(/<img[^>]+src="(https:\/\/tikcdn\.app\/a\/images\/[^"]+)"/gi)];
  const imagenes = [...new Set(coincidenciasImg.map(m => m[1]))];

  if (imagenes.length > 0) {
    return { type: 'image', title: titulo, images: imagenes, mp3Link: enlaceMp3 };
  }

  throw new Error('No se encontró un video o imágenes descargables en el enlace proporcionado.');
}

// --- Definición del Comando ---

const tiktokCommand = {
  name: "tiktok",
  category: "descargas",
  description: "Descarga videos o imágenes de TikTok sin marca de agua.",
  aliases: ["tt", "ttdl"],

  async execute({ sock, msg, args }) {
    const url = args[0];
    if (!url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un enlace de TikTok." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Procesando tu enlace de TikTok..." }, { quoted: msg });

    try {
      const resultado = await descargarDeTikTok(url);

      if (resultado.type === 'video') {
        await sock.sendMessage(msg.key.remoteJid, {
          video: { url: resultado.mp4Links[0].href },
          caption: `🎬 *Título:* ${resultado.title}`
        }, { quoted: msg });
      } else if (resultado.type === 'image') {
        await sock.sendMessage(msg.key.remoteJid, { text: `🖼️ Descargando ${resultado.images.length} imágenes...` }, { quoted: msg });
        for (let i = 0; i < resultado.images.length; i++) {
          await sock.sendMessage(msg.key.remoteJid, {
            image: { url: resultado.images[i] },
            caption: `*Imagen ${i + 1} de ${resultado.images.length}*\n*Título:* ${resultado.title}`
          }, { quoted: msg });
        }
      }

      if (resultado.mp3Link) {
        await sock.sendMessage(msg.key.remoteJid, { text: `🎧 Enviando el audio del video...` }, { quoted: msg });
        await sock.sendMessage(msg.key.remoteJid, {
          audio: { url: resultado.mp3Link.href },
          mimetype: 'audio/mpeg'
        }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, { text: "✅ ¡Descarga completada!", edit: waitingMsg.key });

    } catch (e) {
      console.error("Error en el comando tiktok:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: `😔 Ocurrió un error al descargar desde TikTok.\n> \`${e.message}\`` }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default tiktokCommand;
