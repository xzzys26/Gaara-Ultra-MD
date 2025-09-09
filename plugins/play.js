import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';
import { downloadWithYtdlp, downloadWithDdownr } from '../lib/downloaders.js';

const playCommand = {
  name: "play",
  category: "descargas",
  description: "Busca y descarga una canción en formato de audio (MP3) usando múltiples métodos.",

  async execute({ sock, msg, args }) {
    if (args.length === 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "𝘗𝘰𝘳𝘧𝘢𝘷𝘰𝘳 𝘘𝘶𝘦 𝘈𝘶𝘥𝘪𝘰 𝘋𝘦 𝘔𝘶𝘴𝘪𝘤𝘢 𝘘𝘶𝘪𝘦𝘳𝘦𝘴 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 🎵" }, { quoted: msg });
    }

    const query = args.join(' ');
    let waitingMsg;

    try {
      waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🔎 𝗕𝘂𝘀𝗰𝗮𝗻𝗱𝗼 𝗮𝘂𝗱𝗶𝗼 𝗠𝘂𝘀𝗶𝗰𝗮 "${query}"...` }, { quoted: msg });

      const searchResults = await yts(query);
      if (!searchResults.videos.length) throw new Error("𝙽𝙾 𝚂𝙴 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝚁𝙾𝙽 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 𝙳𝙴𝙻 𝙰𝚄𝙳𝙸𝙾");

      const videoInfo = searchResults.videos[0];
      const { title, url } = videoInfo;

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ 𝗘𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗼: *${title}*.\n\n🔄 𝗱𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗻𝗱𝗼 𝘁𝘂 𝗮𝘂𝗱𝗶𝗼 𝗠𝘂𝘀𝗶𝗰𝗮...` }, { edit: waitingMsg.key });

      let audioBuffer;

      // --- Sistema de Fallbacks Silencioso ---
      try {
        const tempFilePath = await downloadWithYtdlp(url, false); // false para audio
        audioBuffer = fs.readFileSync(tempFilePath);
        fs.unlinkSync(tempFilePath);
      } catch (e1) {
        console.error("play: yt-dlp failed:", e1.message);
        try {
            const downloadUrl = await downloadWithDdownr(url, false); // false para audio
            const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            audioBuffer = response.data;
        } catch (e2) {
            console.error("play: ddownr failed:", e2.message);
            throw new Error("Todos los métodos de descarga han fallado.");
        }
      }

      if (!audioBuffer) {
        throw new Error("El buffer de audio está vacío después de todos los intentos.");
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ 𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗮 𝗘𝗻𝘃𝗶𝗮𝗻𝗱𝗼 𝗔𝗿𝗰𝗵𝗶𝘃𝗼 𝗨𝗻 𝗠𝗼𝗺𝗲𝗻𝘁𝗼...` }, { edit: waitingMsg.key });

      // Enviar como audio reproducible
      await sock.sendMessage(msg.key.remoteJid, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: msg });

      // Enviar como documento
      await sock.sendMessage(msg.key.remoteJid, { document: audioBuffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: msg });

    } catch (error) {
      console.error("Error final en el comando play:", error);
      const errorMsg = { text: `❌ ${error.message}` };
       if (waitingMsg) {
        await sock.sendMessage(msg.key.remoteJid, { ...errorMsg, edit: waitingMsg.key });
      } else {
        await sock.sendMessage(msg.key.remoteJid, errorMsg, { quoted: msg });
      }
    }
  }
};

export default playCommand;
