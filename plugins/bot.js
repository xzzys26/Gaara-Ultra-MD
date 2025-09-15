import { readFileSync } from 'fs';
import os from 'os';

const botCommand = {
  name: "bot",
  category: "general",
  description: "Muestra información sobre el bot.",
  aliases: ["infobot"],

  async execute({ sock, msg, config, commands }) {
    // Leer versión de Baileys
    let baileysVersion = 'N/A';
    try {
      const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
      baileysVersion = packageJson.dependencies['@whiskeysockets/baileys'] || 'N/A';
    } catch (e) {
      console.error("No se pudo leer la versión de Baileys desde package.json");
    }

    // Tiempo activo
    const uptime = (os.uptime() / 60).toFixed(0); // en minutos

    // Texto con decoración
    const botInfo = `
╭━━━〔 🤖 *INFORMACIÓN DEL BOT* 🤖 〕━━━⬣
┃
┃ 📛 *Nombre:* ${config.botName}
┃ 👑 *Fundador:* ${config.ownerName}
┃ 📦 *Módulos Activos:* ${commands.size}
┃ ⚙️ *Framework:* Baileys ${baileysVersion}
┃ ⏳ *Activo desde:* ${uptime} min
┃ 🔑 *Prefijo:* ${config.prefix || '.'}
┃ 📡 *Estado:* Operativo ✅
┃ ☁️ *Alojamiento:* Duluxe Host ⚡ (VIP)
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

    // Reacción previa 🤖
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🤖", key: msg.key }
    });

    // Envío del mensaje
    await sock.sendMessage(
      msg.key.remoteJid,
      { text: botInfo },
      { quoted: msg }
    );
  }
};

export default botCommand;