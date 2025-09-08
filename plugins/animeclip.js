import axios from 'axios';

const animeclipCommand = {
  name: "animeclip",
  category: "diversion",
  description: "Envía un clip de anime al azar.",
  aliases: ["clip"],

  async execute({ sock, msg }) {
    try {
      await sock.sendMessage(msg.key.remoteJid, { text: "Buscando un clip de anime..." }, { quoted: msg });

      // Usamos la API de waifu.pics que es más estable
      const apiResponse = await axios.get('https://api.waifu.pics/sfw/dance');

      // LOG DE DIAGNÓSTICO
      console.log("Respuesta de la API de animeclip:", JSON.stringify(apiResponse.data, null, 2));

      const videoUrl = apiResponse.data?.url;

      if (!videoUrl) {
        throw new Error("La API no devolvió una URL de video válida.");
      }

      // Descargar el video a un buffer para asegurar el envío
      const videoResponse = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 120000 // 2 minutos de timeout
      });

      const contentType = videoResponse.headers['content-type'];
      if (!contentType || !contentType.startsWith('video/')) {
          throw new Error(`La URL no devolvió un video, sino un ${contentType}.`);
      }

      const videoBuffer = Buffer.from(videoResponse.data, 'binary');

      await sock.sendMessage(msg.key.remoteJid, {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: "Aquí tienes tu clip de anime."
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando animeclip:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo obtener un clip en este momento. La API podría estar fallando.` }, { quoted: msg });
    }
  }
};

export default animeclipCommand;
