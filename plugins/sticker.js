import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import axios from 'axios';

// Función para validar si un texto es una URL de imagen/video válida
function isUrl(text) {
    return /^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(text);
}

const stickerCommand = {
  name: "sticker",
  category: "utilidades",
  description: "Convierte una imagen, video o URL en un sticker. Opcional: `sticker <pack> | <autor>`",
  aliases: ["s", "stiker"],

  async execute({ sock, msg, args, config }) {
    const from = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const text = args.join(' ');

    let packname = config.botName || 'Bot';
    let author = config.ownerName || 'Jules';

    if (text.includes('|')) {
        [packname, author] = text.split('|').map(s => s.trim());
    }

    let mediaMessage;
    let buffer;

    // Prioridad 1: Mensaje citado
    if (quoted) {
        mediaMessage = quoted;
    }
    // Prioridad 2: Mensaje con imagen/video
    else if (msg.message?.imageMessage || msg.message?.videoMessage) {
        mediaMessage = msg.message;
    }

    try {
        if (mediaMessage) {
            if (mediaMessage.videoMessage && mediaMessage.videoMessage.seconds > 10) {
                return sock.sendMessage(from, { text: "El video es demasiado largo. El límite es de 10 segundos." }, { quoted: msg });
            }
            const stream = await downloadContentFromMessage(mediaMessage.imageMessage || mediaMessage.videoMessage, mediaMessage.imageMessage ? 'image' : 'video');
            buffer = Buffer.from([]);
            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
        }
        // Prioridad 3: URL en los argumentos
        else if (args[0] && isUrl(args[0])) {
            const url = args[0];
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            buffer = response.data;
        } else {
            return sock.sendMessage(from, { text: "Responde a una imagen/video, o envía una URL, para crear un sticker." }, { quoted: msg });
        }

        if (!buffer) {
            throw new Error("No se pudo obtener el medio para crear el sticker.");
        }

        const sticker = new Sticker(buffer, {
            pack: packname,
            author: author,
            type: StickerTypes.FULL,
            quality: 50
        });

        const stickerBuffer = await sticker.toBuffer();
        await sock.sendMessage(from, { sticker: stickerBuffer });

    } catch (e) {
        console.error("Error en el comando sticker:", e);
        await sock.sendMessage(from, { text: "Ocurrió un error al crear el sticker. Asegúrate de que el medio sea válido." }, { quoted: msg });
    }
  }
};

export default stickerCommand;
