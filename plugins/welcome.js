import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path from "path";

// Configuración por grupo (simulada)
let groupSettings = {};

const welcomeCommand = {
  name: "welcome",
  category: "grupos",
  description: "Envía un mensaje de bienvenida con imagen personalizada y texto en Canvas.",

  async execute({ sock, msg, args, commands, config }) {
    const groupId = msg.key.remoteJid;

    // Inicializar configuración del grupo si no existe
    if (!groupSettings[groupId]) {
      groupSettings[groupId] = {
        enabled: false,
        welcomeText: "¡Hola {user}, bienvenido al grupo {group}!",
        bgImage: "./background.jpg", // ruta por defecto de la imagen de fondo
      };
    }

    const settings = groupSettings[groupId];

    // Activar / desactivar welcome
    if (args[0] === "on") {
      settings.enabled = true;
      return await sock.sendMessage(groupId, { text: "✅ Bienvenida activada." }, { quoted: msg });
    }
    if (args[0] === "off") {
      settings.enabled = false;
      return await sock.sendMessage(groupId, { text: "❌ Bienvenida desactivada." }, { quoted: msg });
    }

    // Cambiar texto de bienvenida
    if (args[0] === "set") {
      const newText = args.slice(2).join(" ");
      if (args[1] === "welcome") {
        settings.welcomeText = newText;
        return await sock.sendMessage(groupId, { text: "✅ Texto de bienvenida actualizado." }, { quoted: msg });
      }
    }

    if (!settings.enabled) return;

    // Función para generar imagen
    const generateWelcomeImage = async (username) => {
      const width = 800;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Fondo
      if (fs.existsSync(settings.bgImage)) {
        const background = await loadImage(settings.bgImage);
        ctx.drawImage(background, 0, 0, width, height);
      } else {
        ctx.fillStyle = "#00bfff"; // color por defecto si no hay imagen
        ctx.fillRect(0, 0, width, height);
      }

      // Texto
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px Sans";
      ctx.textAlign = "center";

      const text = settings.welcomeText.replace("{user}", username).replace("{group}", "este grupo");
      wrapText(ctx, text, width / 2, height / 2, 700, 60); // función para texto en varias líneas

      return canvas.toBuffer();
    };

    // Función para texto en varias líneas
    const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      let testLine = "";
      let metrics;
      let testWidth;
      let offsetY = 0;

      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + " ";
        metrics = ctx.measureText(testLine);
        testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y + offsetY);
          line = words[n] + " ";
          offsetY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y + offsetY);
    };

    // Nombre del usuario (puedes reemplazar por msg.sender si quieres automático)
    const username = args[1] || "Usuario";

    const imageBuffer = await generateWelcomeImage(username);

    // Enviar la imagen
    await sock.sendMessage(groupId, { image: imageBuffer, caption: settings.welcomeText.replace("{user}", username) }, { quoted: msg });
  }
};

export default welcomeCommand;