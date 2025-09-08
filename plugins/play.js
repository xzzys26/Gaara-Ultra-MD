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
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona el nombre de una canción." }, { quoted: msg });
    }

    const query = args.join(' ');
    let waitingMsg;

    try {
      waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🎶 Buscando "${query}"...` }, { quoted: msg });

      const searchResults = await yts(query);
      if (!searchResults.videos.length) throw new Error("No se encontraron resultados para tu búsqueda.");

      const videoInfo = searchResults.videos[0];
      const { title, url } = videoInfo;

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Encontrado: *${title}*.\n\n⬇️ Descargando...` }, { edit: waitingMsg.key });

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

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Descarga completada. Enviando archivos...` }, { edit: waitingMsg.key });

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
