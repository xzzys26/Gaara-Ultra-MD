import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { readUsersDb, writeUsersDb } from "../lib/database.js";

const unregisterCommand = {
  name: "unreg",
  category: "general",
  description: "Elimina tu registro del sistema del bot.",
  aliases: ["unregister"],

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();

    if (!usersDb[senderId]) {
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ No estás registrado." }, { quoted: msg });
    }

    // Número de serie (últimos 4 del ID de WhatsApp)
    const serialNumber = senderId.substring(senderId.length - 8, senderId.length - 4);
    const confirmation = args[0];

    if (confirmation !== serialNumber) {
      return sock.sendMessage(
        msg.key.remoteJid,
        {
          text:
            "⚠️ *Confirmación Requerida* ⚠️\n\n" +
            "Para eliminar tu registro, debes confirmar con tu número de serie único.\n" +
            `👉 Usa el comando: \`unreg ${serialNumber}\``,
        },
        { quoted: msg }
      );
    }

    delete usersDb[senderId];
    writeUsersDb(usersDb);

    // === Crear comprobante visual sin cuadros ===
    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // Fondo degradado oscuro elegante
    const gradient = ctx.createLinearGradient(0, 0, 900, 500);
    gradient.addColorStop(0, "#0d0d0d");
    gradient.addColorStop(1, "#1a0000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 500);

    // Logo
    const logo = await loadImage("https://files.catbox.moe/mzaho9.jpg");
    ctx.drawImage(logo, 40, 30, 100, 100);

    // Título futurista
    ctx.fillStyle = "#ff2b2b";
    ctx.font = "bold 42px Sans";
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 20;
    ctx.fillText("❌ REGISTRO ELIMINADO", 160, 80);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#bbb";
    ctx.font = "26px Sans";
    ctx.fillText("by Gaara Ultra", 165, 115);

    // Mensaje principal (sin cuadros)
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px Sans";
    ctx.fillText("🗑️ Tu registro ha sido eliminado.", 100, 250);
    ctx.fillText("⛔ Ya no podrás usar la mayoría", 100, 300);
    ctx.fillText("de los comandos del bot.", 100, 350);

    ctx.shadowBlur = 0;

    // Guardar imagen
    const filePath = "./temp/unregistro.png";
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: "❌ Tu registro ha sido eliminado.",
    });

    // Avisar en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Registro eliminado exitosamente. Revisa tu privado para ver tu comprobante.",
    });
  },
};

export default unregisterCommand;