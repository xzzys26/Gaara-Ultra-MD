import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Helper function to upload a file
async function uploadToCdnmega(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post("https://cdnmega.vercel.app/upload", formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const result = response.data;
    return result.success ? result.files : null;
  } catch (error) {
    console.error("Error al subir archivo a cdnmega:", error);
    return null;
  }
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

    const messageType = Object.keys(quoted)[0];
    const mediaMessage = quoted[messageType];
    const mediaType = messageType.replace('Message', ''); // 'image', 'video', etc.

    if (!mediaMessage) {
        return sock.sendMessage(from, { text: "El mensaje citado no contiene un archivo válido." }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(from, { text: "📥 Subiendo archivo..." }, { quoted: msg });
    let tempFilePath = '';

    try {
      const stream = await downloadContentFromMessage(mediaMessage, mediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Guardar en un archivo temporal
      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const extension = mediaMessage.mimetype.split('/')[1] || 'bin';
      tempFilePath = path.join(tempDir, `${Date.now()}.${extension}`);
      fs.writeFileSync(tempFilePath, buffer);

      // Subir el archivo
      const uploadedFiles = await uploadToCdnmega(tempFilePath);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("La API de subida no devolvió ningún archivo.");
      }

      const file = uploadedFiles[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

      const caption = `✅ *Archivo Subido Exitosamente*\n\n` +
                      `≡ *URL:* ${file.url}\n` +
                      `≡ *Nombre:* ${file.name}\n` +
                      `≡ *Tamaño:* ${sizeMB} MB`;

      await sock.sendMessage(from, { text: caption }, { quoted: msg, edit: waitingMsg.key });

    } catch (e) {
      console.error("Error en el comando tourl:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al subir el archivo." }, { quoted: msg, edit: waitingMsg.key });
    } finally {
      // Limpiar el archivo temporal
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
};

export default tourlCommand;
