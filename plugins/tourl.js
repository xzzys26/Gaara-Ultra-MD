import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import FormData from 'form-data';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// Sube un buffer directamente a Catbox y devuelve la URL
async function uploadToCatbox(buffer, filename, mime) {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', buffer, {
    filename,
    contentType: mime || 'application/octet-stream',
  });

  const res = await axios.post('https://catbox.moe/user/api.php', formData, {
    headers: formData.getHeaders(),
    responseType: 'text',
    transformResponse: [(data) => data], // evita parseo automático
  });

  const url = typeof res.data === 'string' ? res.data.trim() : '';
  if (!/^https?:\/\/.+/i.test(url)) {
    throw new Error(`Respuesta inválida de Catbox: ${String(res.data).slice(0, 200)}`);
  }
  return url;
}

const tourlCommand = {
  name: "tourl",
  category: "utilidades",
  description: "Sube un archivo (imagen, video, etc.) y genera un enlace público.",
  aliases: ["up"],

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return sock.sendMessage(from, { text: "Por favor, responde a una imagen, video o documento para subirlo." }, { quoted: msg });
    }

    const messageType = Object.keys(quoted)[0]; // p.ej. imageMessage, videoMessage, documentMessage
    const mediaMessage = quoted[messageType];
    const mediaType = messageType.replace('Message', ''); // 'image', 'video', 'document', etc.

    if (!mediaMessage) {
      return sock.sendMessage(from, { text: "El mensaje citado no contiene un archivo válido." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(from, { text: "📥 Subiendo archivo..." }, { quoted: msg });

    try {
      const stream = await downloadContentFromMessage(mediaMessage, mediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Detectar tipo de archivo
      const detected = await fileTypeFromBuffer(buffer);
      const mime = detected?.mime || mediaMessage.mimetype || 'application/octet-stream';
      const extFromMime = mediaMessage.mimetype?.split('/')?.[1];
      const ext = detected?.ext || extFromMime || 'bin';

      // Nombre aleatorio
      const randomName = `${crypto.randomBytes(5).toString('hex')}.${ext}`;

      // Subir a Catbox
      const url = await uploadToCatbox(buffer, randomName, mime);

      const caption =
        `*乂 C A T B O X - U P L O A D E R 乂*\n\n` +
        `*» Enlace* : ${url}\n` +
        `*» Nombre* : ${randomName}\n` +
        `*» Tamaño* : ${formatBytes(buffer.length)}\n` +
        `*» Expiración* : No expira`;

      await sock.sendMessage(from, { text: caption }, { quoted: msg, edit: waitingMsg.key });
    } catch (e) {
      console.error("Error en el comando tourl:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al subir el archivo." }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default tourlCommand;
