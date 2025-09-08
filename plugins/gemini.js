import axios from 'axios';

const geminiCommand = {
  name: "gemini",
  category: "ias",
  description: "Habla con una IA (modelo Qwen).",

  async execute({ sock, msg, args }) {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, hazme una pregunta." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: "🧠 Pensando..." }, { quoted: msg });

    try {
      const apiUrl = `https://myapiadonix.vercel.app/ai/qwen?text=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      const result = response.data;

      if (!result.status || !result.result) {
        throw new Error("La respuesta de la API no fue exitosa o no contenía un resultado.");
      }

      await sock.sendMessage(msg.key.remoteJid, { text: result.result }, { quoted: msg, edit: waitingMsg.key });

    } catch (error) {
      console.error("Error en el comando gemini (qwen):", error.message);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al contactar a la IA." }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default geminiCommand;
