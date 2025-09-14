import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const tourlCommand = {
  name: "tourl",
  category: "grupos",
  description: "Sube archivos (imágenes, videos, etc.) a Catbox y devuelve el enlace.",

  async execute({ sock, msg, args, commands, config }) {
    const q = msg.quoted ? msg.quoted : msg;
    const mime = (q.message || q).mimetype || '';
    if (!mime) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "⚠️ Responde a un archivo válido (imagen, video, etc.)." },
        { quoted: msg }
      );
    }

    try {
      const media = await q.download();
      const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
      const link = await catbox(media);

      let txt = `*乂 C A T B O X - U P L O A D E R 乂*\n\n`;
      txt += `*» Enlace* : ${link}\n`;
      txt += `*» Tamaño* : ${formatBytes(media.length)}\n`;
      txt += `*» Expiración* : ${isTele ? 'No expira' : 'Desconocido'}\n\n`;
      txt += `> 𓆩𝐃𝐞𝐯𓆪`;

      await sock.sendMessage(
        msg.key.remoteJid,
        { image: media, caption: txt },
        { quoted: msg }
      );
    } catch (e) {
      console.error(e);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Error al subir el archivo." },
        { quoted: msg }
      );
    }
  }
};

export default tourlCommand;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return await response.text();
}