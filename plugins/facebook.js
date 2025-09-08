import youtubedl from 'youtube-dl-exec';

const facebookCommand = {
  name: "facebook",
  category: "descargas",
  description: "Descarga un video de Facebook desde un enlace.",
  aliases: ["fb", "fbdl"],

  async execute({ sock, msg, args }) {
    const url = args[0];
    const fbRegex = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/[^\s]+/i;

    if (!url || !fbRegex.test(url)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un enlace válido de Facebook." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🌊 Procesando tu video...` }, { quoted: msg });

    try {
      // Usa youtube-dl-exec para obtener el enlace de descarga directo
      const downloadUrl = await youtubedl(url, {
        getUrl: true,
        format: 'best[ext=mp4][height<=720]/best[ext=mp4]'
      });

      if (!downloadUrl) {
        throw new Error("No se pudo obtener la URL de descarga del video.");
      }

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          video: { url: downloadUrl },
          caption: `✨ ¡Aquí tienes tu video de Facebook!`,
          mimetype: 'video/mp4'
        },
        { quoted: msg }
      );

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ ¡Video enviado!`, edit: waitingMsg.key });

    } catch (error) {
      console.error("Error en el comando facebook (youtube-dl-exec):", error);
      const errorMessage = error.stderr || error.message;
      if (errorMessage.includes('proxy') || errorMessage.includes('HTTP Error 429')) {
        await sock.sendMessage(msg.key.remoteJid, { text: "El servicio de descarga está sobrecargado o bloqueado. Inténtalo más tarde." }, { edit: waitingMsg.key, quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Ocurrió un error. El enlace puede ser inválido, privado o el servicio de descarga estar fallando.`, edit: waitingMsg.key, quoted: msg });
      }
    }
  }
};

export default facebookCommand;
