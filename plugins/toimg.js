import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const toImgCommand = {
  name: "toimg",
  category: "utilidades",
  description: "Convierte un sticker en una imagen.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.stickerMessage) {
      return sock.sendMessage(from, { text: "Debes responder a un sticker para convertirlo en imagen." }, { quoted: msg });
    }

    // No se pueden convertir stickers animados a imagen estática de esta forma simple.
    if (quoted.stickerMessage.isAnimated) {
        return sock.sendMessage(from, { text: "No puedo convertir stickers animados a imagen." }, { quoted: msg });
    }

    try {
      const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker');
      let buffer = Buffer.from([]);
      for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      await sock.sendMessage(from, {
        image: buffer,
        caption: "Aquí tienes tu imagen."
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando toimg:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al convertir el sticker." }, { quoted: msg });
    }
  }
};

export default toImgCommand;
