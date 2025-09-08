import { igdl } from "ruhend-scraper";
import axios from 'axios';

const instagramCommand = {
  name: "instagram",
  category: "descargas",
  description: "Descarga todas las imágenes/videos de una publicación de Instagram.",
  aliases: ["ig", "igdl"],

  async execute({ sock, msg, args }) {
    const url = args[0];
    const igRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9\-_]+/;

    if (!url || !igRegex.test(url)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "*[ ☃️ ] Ingresa un link de Instagram*" }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `*[ 👁️ ] Cargando...*` }, { quoted: msg });

    try {
      let res = await igdl(url);
      let data = res.data;

      if (!data || data.length === 0) {
        throw new Error("No se encontró media en el enlace proporcionado.");
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `Encontrados ${data.length} archivos. Enviando...`}, { edit: waitingMsg.key });

      for (const media of data) {
        // Determinar si es video o imagen basado en la URL o una propiedad
        const isVideo = media.url.includes('.mp4') || media.type === 'video';

        const mediaOptions = {
            caption: '*_DESCARGAS - INSTAGRAM_*\n\n> * [ 🍢 ] archivo descargado correctamente 🪘*',
            mimetype: isVideo ? 'video/mp4' : 'image/jpeg',
        };

        if (isVideo) {
            mediaOptions.video = { url: media.url };
        } else {
            mediaOptions.image = { url: media.url };
        }

        await sock.sendMessage(msg.key.remoteJid, mediaOptions, { quoted: msg });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Pausa entre envíos
      }

    } catch(e) {
      console.error("Error en el comando instagram:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: '*[ 💨 ] OCURRIÓ UN ERROR. Verifica el enlace.' }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default instagramCommand;
