import yts from 'yt-search';
import axios from 'axios';

// --- Helper Functions (adaptadas del código proporcionado) ---

async function showDownloadOptions(sock, msg, videoInfo, testCache, config) {
  try {
    if (videoInfo && videoInfo.seconds > 3780) { // Límite de 63 minutos
      await sock.sendMessage(msg.key.remoteJid, { text: 'El video supera el límite de duración permitido (63 minutos).' }, { quoted: msg });
      return;
    }

    const senderId = msg.key.participant || msg.key.remoteJid;
    testCache.set(senderId, {
      video: videoInfo,
      timestamp: Date.now()
    });

    setTimeout(() => {
      if (testCache.has(senderId)) {
        let cached = testCache.get(senderId);
        if (Date.now() - cached.timestamp > 300000) { // 5 minutos
          testCache.delete(senderId);
        }
      }
    }, 300000);

    const title = videoInfo.title || 'Video sin título';
    const duration = videoInfo.timestamp || 'Desconocida';
    const author = videoInfo.author?.name || 'Canal desconocido';

    let message = `*${title}*\n\n` +
                  `*Canal:* ${author}\n` +
                  `*Duración:* ${duration}\n` +
                  `*URL:* ${videoInfo.url}\n\n` +
                  `Selecciona el formato que deseas descargar:`;

    const templateButtons = [
      { index: 1, quickReplyButton: { displayText: '🎵 Audio', id: `test audio_${senderId}` } },
      { index: 2, quickReplyButton: { displayText: '🎬 Video', id: `test video_${senderId}` } }
    ];

    // Mensaje sin vista previa para evitar dependencia de 'sharp'
    const templateMessage = {
      text: message,
      footer: 'Elige una opción',
      templateButtons: templateButtons,
    };

    await sock.sendMessage(msg.key.remoteJid, templateMessage, { quoted: msg });

  } catch (e) {
    console.error('Error al mostrar opciones de descarga:', e);
    await sock.sendMessage(msg.key.remoteJid, { text: 'Error al mostrar opciones de descarga.' }, { quoted: msg });
  }
}

async function handleDownload(sock, msg, selection, testCache, config) {
  const senderId = msg.key.participant || msg.key.remoteJid;
  const requestedId = selection.split('_')[1];
  const type = selection.split('_')[0];

  if (requestedId !== senderId) {
    return sock.sendMessage(msg.key.remoteJid, { text: '❌ Esta opción de descarga no es para ti.' }, { quoted: msg });
  }

  if (!testCache.has(senderId)) {
    return sock.sendMessage(msg.key.remoteJid, { text: '❌ Tu búsqueda ha expirado o no existe. Realiza una nueva búsqueda.' }, { quoted: msg });
  }

  const cached = testCache.get(senderId);

  try {
    const videoInfo = cached.video;
    const apiUrl = type === 'audio'
      ? `${config.api.ytmp3}?url=${videoInfo.url}`
      : `${config.api.ytmp4}?url=${videoInfo.url}`;

    await sock.sendMessage(msg.key.remoteJid, { text: `Procesando ${type}... (Puede tardar hasta 90 segundos)` }, { quoted: msg });

    const response = await axios.get(apiUrl, { timeout: 90000 });
    const downloadUrl = response.data.resultado.url;

    if (!downloadUrl) throw new Error('La API no devolvió una URL de descarga válida.');

    if (type === 'audio') {
      await sock.sendMessage(msg.key.remoteJid, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { video: { url: downloadUrl }, mimetype: 'video/mp4', caption: `*${videoInfo.title}*` }, { quoted: msg });
    }

    testCache.delete(senderId);

  } catch (e) {
    console.error('Error al procesar la descarga:', e);
    const errorMessage = e.code === 'ECONNABORTED'
      ? 'El servidor de descargas tardó demasiado en responder.'
      : 'Error al procesar la descarga. La API podría estar fallando.';
    await sock.sendMessage(msg.key.remoteJid, { text: errorMessage }, { quoted: msg });
  }
}


// --- Main Handler ---
const testCommand = {
  name: "test",
  category: "descargas",
  description: "Busca y descarga audio/video de YouTube con opciones.",

  async execute({ sock, msg, args, testCache, config }) {
    if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: `Uso correcto: test <enlace o nombre>` }, { quoted: msg });

    try {
      const input = args.join(' ');

      if (input.startsWith('audio_') || input.startsWith('video_')) {
        return await handleDownload(sock, msg, input, testCache, config);
      }

      let videoInfo = null;

      if (input.includes('youtube.com') || input.includes('youtu.be')) {
        let id = input.split('v=')[1]?.split('&')[0] || input.split('/').pop();
        let search = await yts({ videoId: id });
        if (search && search.title) videoInfo = search;
      } else {
        let search = await yts(input);
        if (!search.videos || search.videos.length === 0) {
          return sock.sendMessage(msg.key.remoteJid, { text: 'No se encontraron resultados.' }, { quoted: msg });
        }
        videoInfo = search.videos[0];
      }

      if (videoInfo) {
        await showDownloadOptions(sock, msg, videoInfo, testCache, config);
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: 'No se pudo obtener la información del video.' }, { quoted: msg });
      }

    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Ocurrió un error al procesar la solicitud.' }, { quoted: msg });
    }
  }
};

export default testCommand;
