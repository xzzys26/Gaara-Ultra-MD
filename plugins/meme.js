import axios from 'axios';

const memeCommand = {
  name: "meme",
  category: "diversion",
  description: "Envía un meme al azar.",

  async execute({ sock, msg }) {
    try {
      const apiResponse = await axios.get('https://meme-api.com/gimme/memesenespanol');
      const meme = apiResponse.data;

      if (!meme || !meme.url) {
        throw new Error("La API de memes no devolvió una URL válida.");
      }

      console.log(`[meme.js] URL de imagen obtenida: ${meme.url}`);

      const imageResponse = await axios.get(meme.url, {
        responseType: 'arraybuffer'
      });

      // --- LOG DE DIAGNÓSTICO FINAL ---
      const contentType = imageResponse.headers['content-type'];
      console.log(`[meme.js] Content-Type de la respuesta de la imagen: ${contentType}`);

      // Verificar si la respuesta es realmente una imagen
      if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`La URL no devolvió una imagen, sino un ${contentType}.`);
      }

      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: `*${meme.title}*`
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando meme:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo obtener un meme. Error: ${e.message}` }, { quoted: msg });
    }
  }
};

export default memeCommand;
