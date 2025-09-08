import axios from 'axios';

const ttsCommand = {
  name: "tts",
  category: "utilidades",
  description: "Convierte texto a voz y lo envía como nota de audio.",

  async execute({ sock, msg, args }) {
    const lang = args[0];
    const text = args.slice(1).join(' ');

    if (!lang || !text) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Uso: `tts <código_idioma> <texto>`\nEjemplo: `tts es Hola mundo`" }, { quoted: msg });
    }

    if (text.length > 200) {
        return sock.sendMessage(msg.key.remoteJid, { text: "El texto es demasiado largo. El límite es de 200 caracteres." }, { quoted: msg });
    }

    try {
      const apiUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
        }
      });

      const audioBuffer = Buffer.from(response.data, 'binary');

      if (!audioBuffer || audioBuffer.length < 100) {
        throw new Error("La API no devolvió un audio válido.");
      }

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true // Enviar como nota de voz (Push-to-talk)
        },
        { quoted: msg }
      );

    } catch (error) {
      console.error("Error en el comando tts:", error.message);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al generar el audio. Asegúrate de que el código de idioma sea correcto." }, { quoted: msg });
    }
  }
};

export default ttsCommand;
