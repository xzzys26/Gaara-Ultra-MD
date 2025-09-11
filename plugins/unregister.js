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

    // ID de eliminación
    const deleteId = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Crear canvas
    const canvas = createCanvas(900, 550);
    const ctx = canvas.getContext("2d");

    // Fondo degradado oscuro
    const gradient = ctx.createLinearGradient(0, 0, 900, 550);
    gradient.addColorStop(0, "#0d0d0d");
    gradient.addColorStop(1, "#1a0000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 550);

    // Logo
    const logo = await loadImage("https://files.catbox.moe/mzaho9.jpg");
    ctx.drawImage(logo, 40, 30, 100, 100);

    // Título
    ctx.font = "bold 42px Sans";
    ctx.fillStyle = "#ff2b2b";
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 15;
    ctx.textAlign = "left";
    ctx.fillText("REGISTRO ELIMINADO", 160, 80);

    ctx.shadowBlur = 0;
    ctx.font = "26px Sans";
    ctx.fillStyle = "#bbb";
    ctx.fillText(`by Gaara Ultra | ${deleteId}`, 165, 115);

    // Función para texto multilinea
    const drawMultilineText = (textArray, startX, startY, lineHeight) => {
      ctx.fillStyle = "#fff";
      ctx.font = "26px Sans";
      ctx.shadowColor = "#ff2b2b";
      ctx.shadowBlur = 8;
      textArray.forEach((line, i) => {
        ctx.fillText(line, startX, startY + i * lineHeight);
      });
      ctx.shadowBlur = 0;
    };

    drawMultilineText([
      "Tu registro ha sido eliminado correctamente.",
      "A partir de ahora ya no podrás acceder a la mayoría",
      "de los comandos ni funciones del bot.",
      "Si deseas volver a disfrutar de la experiencia completa,",
      "deberás registrarte nuevamente con el comando `reg`."
    ], 100, 230, 50);

    // Guardar imagen
    const filePath = "./temp/unregistro.png";
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: `Tu registro ha sido eliminado.\nID de eliminación: ${deleteId}`,
    });

    // Aviso en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ Registro eliminado exitosamente.\nID: ${deleteId}`,
    });
  },
};

export default unregisterCommand;