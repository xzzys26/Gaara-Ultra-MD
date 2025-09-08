import axios from 'axios';

const iaCommand = {
  name: "ia",
  category: "ias",
  description: "Envía una pregunta a una IA y recibe una respuesta de voz.",

  async execute({ sock, msg, args, config }) {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, hazme una pregunta." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: "🧠 Pensando..." }, { quoted: msg });

    try {
      const apiUrl = `https://myapiadonix.vercel.app/ai/iavoz?q=${encodeURIComponent(query)}`;

      // La API devuelve un JSON, no el audio directamente.
      const response = await axios.get(apiUrl);

      const result = response.data;
      if (!result.success || !result.audio_base64) {
        throw new Error("La respuesta de la API no fue exitosa o no contenía audio.");
      }

      // Decodificar el audio de Base64 a un Buffer
      const audioBuffer = Buffer.from(result.audio_base64, 'base64');

      // Enviar la respuesta como un mensaje de audio
      await sock.sendMessage(
        msg.key.remoteJid,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true // Enviar como PTT (Push-to-talk)
        },
        { quoted: msg }
      );

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ *Respuesta de IA:* ${result.text}`, edit: waitingMsg.key });

    } catch (error) {
      console.error("Error en el comando ia (voz):", error.message);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al contactar a la IA de voz." }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default iaCommand;
