import { translate } from '@vitalets/google-translate-api';

const translateCommand = {
  name: "translate",
  category: "utilidades",
  description: "Traduce texto a otro idioma.",
  aliases: ["tr"],

  async execute({ sock, msg, args }) {
    const lang = args[0];
    const text = args.slice(1).join(' ');

    if (!lang || !text) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Uso: `translate <código_idioma> <texto>`\nEjemplo: `translate en Hola mundo`" }, { quoted: msg });
    }

    // Manejar respuestas a mensajes
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const textToTranslate = text || quoted?.conversation || quoted?.extendedTextMessage?.text;

    if (!textToTranslate) {
        return sock.sendMessage(msg.key.remoteJid, { text: "No hay texto para traducir. Escribe algo o responde a un mensaje." }, { quoted: msg });
    }

    try {
      const { text: translatedText, raw } = await translate(textToTranslate, { to: lang });
      const fromLang = raw.src;

      const message = `*Traducción*\n\n` +
                      `*De:* ${fromLang}\n` +
                      `*A:* ${lang}\n\n` +
                      `*Resultado:* ${translatedText}`;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando translate:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al traducir. Asegúrate de que el código de idioma sea válido." }, { quoted: msg });
    }
  }
};

export default translateCommand;
