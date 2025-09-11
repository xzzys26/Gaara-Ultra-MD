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

    const userData = usersDb[senderId];
    delete usersDb[senderId];
    writeUsersDb(usersDb);

    // === Crear comprobante visual ===
    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // Fondo oscuro degradado
    const gradient = ctx.createLinearGradient(0, 0, 900, 500);
    gradient.addColorStop(0, "#1a0000");
    gradient.addColorStop(1, "#330000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 500);

    // Logo
    const logo = await loadImage("https://files.catbox.moe/mzaho9.jpg");
    ctx.drawImage(logo, 40, 30, 100, 100);

    // Título rojo neón
    ctx.fillStyle = "#ff2b2b";
    ctx.font = "bold 42px Sans";
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 15;
    ctx.fillText("❌ REGISTRO ELIMINADO", 160, 80);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#bbb";
    ctx.font = "26px Sans";
    ctx.fillText("by Gaara Ultra", 165, 115);

    // Caja de datos eliminados
    ctx.fillStyle = "rgba(30,0,0,0.85)";
    ctx.strokeStyle = "#ff2b2b";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 12;
    ctx.fillRect(60, 170, 780, 280);
    ctx.strokeRect(60, 170, 780, 280);
    ctx.shadowBlur = 0;

    // Datos borrados (tachados en rojo)
    ctx.fillStyle = "#fff";
    ctx.font = "26px Sans";
    ctx.fillText(`👤 Nombre: ${userData.name}`, 100, 220);
    ctx.fillText(`🎂 Edad: ${userData.age}`, 100, 260);
    ctx.fillText(`💰 Monedas: ${userData.coins}`, 100, 300);
    ctx.fillText(`🆔 Serie confirmada: ${serialNumber}`, 100, 340);
    ctx.fillStyle = "#ff4d4d";
    ctx.font = "bold 26px Sans";
    ctx.fillText("🗑️ Datos borrados permanentemente", 100, 400);

    // Guardar imagen
    const filePath = "./temp/unregistro.png";
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: "❌ Tu registro ha sido eliminado correctamente.",
    });

    // Avisar en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Registro eliminado exitosamente. Revisa tu privado para ver tu comprobante.",
    });
  },
};

export default unregisterCommand;