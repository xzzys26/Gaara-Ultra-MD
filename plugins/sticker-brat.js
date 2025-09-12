import { sticker } from "../lib/sticker.js";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
  try {
    const response = await axios.get(`https://api.hanggts.xyz/imagecreator/brat`, {
      params: { text },
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 && attempt <= 3) {
      const retryAfter = error.response.headers["retry-after"] || 5;
      await delay(retryAfter * 1000);
      return fetchSticker(text, attempt + 1);
    }
    throw error;
  }
};

const bratCommand = {
  name: "brat",
  category: "sticker",
  description: "Convierte un texto en un sticker estilo *brat*.",

  async execute({ sock, msg, args, config }) {
    try {
      let text = args.join(" ");

      if (msg.quoted?.conversation) {
        text = msg.quoted.conversation;
      } else if (!text) {
        return sock.sendMessage(
          msg.key.remoteJid,
          { text: "✨️ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker." },
          { quoted: msg }
        );
      }

      const buffer = await fetchSticker(text);

      let userId = msg.key.participant || msg.key.remoteJid;
      let packstickers = global.db.data.users[userId] || {};
      let texto1 = packstickers.text1 || global.packsticker;
      let texto2 = packstickers.text2 || global.packsticker2;

      let stiker = await sticker(buffer, false, texto1, texto2);

      if (stiker) {
        return sock.sendFile(msg.key.remoteJid, stiker, "sticker.webp", "", msg);
      } else {
        throw new Error("✧ No se pudo generar el sticker.");
      }
    } catch (error) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: `⚠️ Ocurrió un error: ${error.message}` },
        { quoted: msg }
      );
    }
  },
};

export default bratCommand;