import axios from 'axios';

const catCommand = {
  name: "cat",
  category: "diversion",
  description: "Envía una foto de un gato al azar.",
  aliases: ["gato"],

  async execute({ sock, msg }) {
    try {
      const apiResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
      const cat = apiResponse.data[0];

      if (!cat || !cat.url) {
        throw new Error("La API de gatos no devolvió una URL válida.");
      }

      const imageResponse = await axios.get(cat.url, {
        responseType: 'arraybuffer'
      });

      const contentType = imageResponse.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`La URL no devolvió una imagen, sino un ${contentType}.`);
      }

      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: "¡Aquí tienes un lindo gatito! 🐱"
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando cat:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo obtener una foto de un gato. Error: ${e.message}` }, { quoted: msg });
    }
  }
};

export default catCommand;
