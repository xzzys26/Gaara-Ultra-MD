import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { readUsersDb, writeUsersDb } from "../lib/database.js";

const INITIAL_COINS = 1000;

const registerCommand = {
  name: "reg",
  category: "general",
  description: "Te registra en el sistema del bot. Uso: reg <nombre>.<edad>",
  aliases: ["registrar", "register"],

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();

    if (usersDb[senderId]) {
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Ya estás registrado." }, { quoted: msg });
    }

    const input = args.join(" ");
    if (!input.includes(".")) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Formato incorrecto.\nUso: `reg <nombre>.<edad>`\nEjemplo: `reg Jules.25`" },
        { quoted: msg }
      );
    }

    const [name, ageStr] = input.split(".");
    const age = parseInt(ageStr, 10);

    if (!name || isNaN(age) || age < 10 || age > 90) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Ingresa un nombre válido y una edad entre 10 y 90 años." },
        { quoted: msg }
      );
    }

    // Guardar usuario
    usersDb[senderId] = {
      name: name.trim(),
      age,
      registeredAt: new Date().toISOString(),
      coins: INITIAL_COINS,
      warnings: 0,
    };
    writeUsersDb(usersDb);

    // Crear ID
    const registroId = `REG-${Math.floor(Math.random() * 1000000)}`;

    // Crear imagen estilo futurista
    const canvas = createCanvas(900, 550);
    const ctx = canvas.getContext("2d");

    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 900, 550);
    gradient.addColorStop(0, "#f0f4ff");
    gradient.addColorStop(1, "#dce7ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 550);

    // Cargar logo
    const logo = await loadImage("https://files.catbox.moe/mzaho9.jpg");
    ctx.drawImage(logo, 40, 30, 100, 100);

    // Título
    ctx.fillStyle = "#007bff";
    ctx.font = "bold 38px Sans";
    ctx.fillText("✅ REGISTRO EXITOSO", 160, 80);

    ctx.fillStyle = "#444";
    ctx.font = "28px Sans";
    ctx.fillText("by Gaara Ultra", 165, 115);

    // Caja principal (blanca con sombra)
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 10;
    ctx.fillRect(60, 170, 780, 330);
    ctx.shadowBlur = 0;

    // Datos
    ctx.fillStyle = "#000";
    ctx.font = "26px Sans";
    ctx.fillText(`👤 Nombre: ${name.trim()}`, 100, 220);
    ctx.fillText(`🎂 Edad: ${age}`, 100, 270);
    ctx.fillText(`💰 Monedas iniciales: ${INITIAL_COINS}`, 100, 320);
    ctx.fillText(`📅 Fecha: ${new Date().toLocaleString("es-ES")}`, 100, 370);
    ctx.fillText(`🆔 ID: ${registroId}`, 100, 420);

    // Guardar imagen
    const filePath = "./temp/registro_exitoso.png";
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: "🎉 Bienvenido/a al sistema del bot 🎉",
    });

    // Avisar en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Registro completado. Revisa tu privado para ver tu *comprobante futurista de registro*.",
    });
  },
};

export default registerCommand;