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

    // === Crear comprobante visual ===
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

    // Generar ID de eliminación
    const deleteId = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Título
    ctx.fillStyle = "#ff2b2b";
    ctx.font = "bold 42px Sans";
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 15;
    ctx.fillText("❌ REGISTRO ELIMINADO", 160, 80);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#bbb";
    ctx.font = "26px Sans";
    ctx.fillText(`by Gaara Ultra | ${deleteId}`, 165, 115);

    // Texto más largo y sin cuadros
    ctx.fillStyle = "#fff";
    ctx.font = "26px Sans";
    ctx.shadowColor = "#ff2b2b";
    ctx.shadowBlur = 8;
    ctx.fillText("Tu registro ha sido eliminado correctamente.", 100, 230);
    ctx.fillText("A partir de ahora ya no podrás acceder a la mayoría", 100, 280);
    ctx.fillText("de los comandos ni funciones del bot.", 100, 320);
    ctx.fillText("Si deseas volver a disfrutar de la experiencia completa,", 100, 370);
    ctx.fillText("deberás registrarte nuevamente con el comando `reg`.", 100, 410);

    ctx.shadowBlur = 0;

    // Guardar imagen
    const filePath = "./temp/unregistro.png";
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: `❌ Tu registro ha sido eliminado.\nID de eliminación: ${deleteId}`,
    });

    // Avisar en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Registro eliminado exitosamente. Revisa tu privado para ver tu comprobante.",
    });
  },
};

export default unregisterCommand;