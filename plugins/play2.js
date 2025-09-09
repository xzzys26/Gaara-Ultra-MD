import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';
import { downloadWithYtdlp, downloadWithDdownr } from '../lib/downloaders.js';

// Helper for the extra APIs
async function downloadWithApi(apiUrl) {
    const response = await axios.get(apiUrl);
    const result = response.data;
    const downloadUrl = result?.result?.downloadUrl || result?.result?.url || result?.data?.dl || result?.dl;
    if (!downloadUrl) throw new Error(`API ${apiUrl} did not return a valid download link.`);

    const file = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    return file.data;
}

const play2Command = {
  name: "play2",
  category: "descargas",
  description: "Busca y descarga un video en formato MP4 usando múltiples métodos.",

  async execute({ sock, msg, args }) {
    if (args.length === 0) return sock.sendMessage(msg.key.remoteJid, { text: "𝘗𝘰𝘳𝘧𝘢𝘷𝘰𝘳 𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘌𝘭 𝘝𝘪𝘥𝘦𝘰 𝘔𝘶𝘴𝘪𝘤𝘢 𝘘𝘶𝘦 𝘘𝘶𝘪𝘦𝘳𝘦𝘴 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 🎵" }, { quoted: msg });

    const query = args.join(' ');
    let waitingMsg;

    try {
      waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🔎 𝗕𝘂𝘀𝗰𝗮𝗻𝗱𝗼 𝗩𝗶𝗱𝗲𝗼 𝗠𝘂𝘀𝗶𝗰𝗮 🎵 "${query}"...` }, { quoted: msg });

      const searchResults = await yts(query);
      if (!searchResults.videos.length) throw new Error("No se encontraron resultados.");

      const videoInfo = searchResults.videos[0];
      const { title, url } = videoInfo;

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ 𝗘𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗼: *${title}*.\n\n🔄 𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗻𝗱𝗼 𝗩𝗶𝗱𝗲𝗼 𝗠𝘂𝘀𝗶𝗰𝗮...` }, { edit: waitingMsg.key });

      let videoBuffer;

      // --- Fallback System ---
      try {
        const tempFilePath = await downloadWithYtdlp(url, true); // true para video
        videoBuffer = fs.readFileSync(tempFilePath);
        fs.unlinkSync(tempFilePath);
      } catch (e1) {
        console.error("play2: yt-dlp failed:", e1.message);
        try {
          const downloadUrl = await downloadWithDdownr(url, true); // true para video
          const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
          videoBuffer = response.data;
        } catch (e2) {
          console.error("play2: ddownr failed:", e2.message);
          const fallbackApis = [
            `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`,
            `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`,
            `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(url)}`
          ];
          let success = false;
          for (const apiUrl of fallbackApis) {
            try {
              videoBuffer = await downloadWithApi(apiUrl);
              success = true;
              break;
            } catch (e3) {
              console.error(`API ${apiUrl} failed:`, e3.message);
            }
          }
          if (!success) throw new Error("Todos los métodos de descarga de video han fallado.");
        }
      }

      if (!videoBuffer) throw new Error("El buffer de video está vacío.");

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ 𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗮 𝗘𝗻𝘃𝗶𝗮𝗻𝗱𝗼 𝗩𝗶𝗱𝗲𝗼 𝗠𝘂𝘀𝗶𝗰𝗮 🎵...` }, { edit: waitingMsg.key });

      await sock.sendMessage(msg.key.remoteJid, { video: videoBuffer, mimetype: 'video/mp4', caption: title }, { quoted: msg });

    } catch (error) {
      console.error("Error final en play2:", error);
      const errorMsg = { text: `❌ ${error.message}` };
       if (waitingMsg) {
        await sock.sendMessage(msg.key.remoteJid, { ...errorMsg, edit: waitingMsg.key });
      } else {
        await sock.sendMessage(msg.key.remoteJid, errorMsg, { quoted: msg });
      }
    }
  }
};

export default play2Command;
