import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { readUsersDb, writeUsersDb } from "../lib/database.js";

const INITIAL_COINS = 1000;

const registerCommand = {
  name: "reg",
  category: "general",
  description: "Te registra en el sistema del bot. Uso: reg <nombre>.<edad> [light|dark]",
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
        { text: "❌ Formato incorrecto.\nUso: `reg <nombre>.<edad> [light|dark]`\nEjemplo: `reg Jules.25 dark`" },
        { quoted: msg }
      );
    }

    // Extraer nombre, edad y estilo
    const parts = input.split(".");
    const name = parts[0].trim();
    const rest = parts[1].split(" ");
    const age = parseInt(rest[0], 10);
    const style = rest[1]?.toLowerCase() || "dark"; // por defecto oscuro

    if (!name || isNaN(age) || age < 10 || age > 90) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Ingresa un nombre válido y una edad entre 10 y 90 años." },
        { quoted: msg }
      );
    }

    // Guardar usuario en DB
    usersDb[senderId] = {
      name,
      age,
      registeredAt: new Date().toISOString(),
      coins: INITIAL_COINS,
      warnings: 0,
    };
    writeUsersDb(usersDb);

    // Crear ID de registro
    const registroId = `REG-${Math.floor(Math.random() * 1000000)}`;

    // Crear canvas
    const canvas = createCanvas(900, 550);
    const ctx = canvas.getContext("2d");

    // Fondo según estilo
    if (style === "light") {
      const gradient = ctx.createLinearGradient(0, 0, 900, 550);
      gradient.addColorStop(0, "#f8f9fa");
      gradient.addColorStop(1, "#e9ecef");
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 900, 550);
      gradient.addColorStop(0, "#0d0d0d");
      gradient.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, 900, 550);

    // Logo
    const logo = await loadImage("https://files.catbox.moe/mzaho9.jpg");
    ctx.drawImage(logo, 40, 30, 100, 100);

    // Título
    ctx.font = "bold 42px Sans";
    ctx.fillStyle = style === "light" ? "#007bff" : "#00eaff";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = style === "light" ? 6 : 15;
    ctx.fillText("REGISTRO EXITOSO", 160, 80);

    ctx.shadowBlur = 0;
    ctx.font = "26px Sans";
    ctx.fillStyle = style === "light" ? "#444" : "#aaa";
    ctx.fillText("by Gaara Ultra", 165, 115);

    // Datos (sin cuadros ni emojis)
    ctx.fillStyle = style === "light" ? "#000" : "#fff";
    ctx.font = "26px Sans";
    ctx.fillText(`Nombre: ${name}`, 100, 220);
    ctx.fillText(`Edad: ${age}`, 100, 270);
    ctx.fillText(`Monedas iniciales: ${INITIAL_COINS}`, 100, 320);
    ctx.fillText(`Fecha: ${new Date().toLocaleString("es-ES")}`, 100, 370);
    ctx.fillText(`ID: ${registroId}`, 100, 420);

    // Guardar imagen
    const filePath = `./temp/registro_${style}.png`;
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // Enviar imagen al privado
    await sock.sendMessage(senderId, {
      image: { url: filePath },
      caption: ` Bienvenido/a al sistema del bot (modo ${style}) ✨`,
    });

    // Aviso en el chat original
    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ Registro completado.\n📩 Revisa tu privado para ver tu comprobante (${style}).`,
    });
  },
};

export default registerCommand;