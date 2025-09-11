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

    // Generar imagen personalizada
    const canvas = createCanvas(800, 500);
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, 800, 500);

    // Título
    ctx.fillStyle = "#007bff";
    ctx.font = "bold 40px Sans";
    ctx.fillText("🧾 REGISTRO EXITOSO ✅", 180, 80);

    // Datos del usuario
    ctx.fillStyle = "#000";
    ctx.font = "28px Sans";
    ctx.fillText(`👤 Nombre: ${name.trim()}`, 100, 180);
    ctx.fillText(`🎂 Edad: ${age}`, 100, 230);
    ctx.fillText(`💰 Monedas iniciales: ${INITIAL_COINS}`, 100, 280);
    ctx.fillText(`📅 Fecha: ${new Date().toLocaleString("es-ES")}`, 100, 330);
    ctx.fillText(`🆔 ID: REG-${Math.floor(Math.random() * 1000000)}`, 100, 380);

    // Guardar la imagen
    const filePath = "./temp/registro.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    // Enviar al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: "🎉 Bienvenido/a al sistema del bot 🎉",
    });

    // Avisar en el chat
    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Registro completado. Revisa tu privado para ver tu *comprobante de registro*.",
    });
  },
};

export default registerCommand;