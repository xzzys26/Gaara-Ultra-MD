import { readFileSync } from 'fs';

const botCommand = {
  name: "bot",
  category: "general",
  description: "Muestra información sobre el bot.",
  aliases: ["infobot"],

  async execute({ sock, msg, config, commands }) {
    // Leer la versión de Baileys desde package.json
    let baileysVersion = 'N/A';
    try {
        const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
        baileysVersion = packageJson.dependencies['@whiskeysockets/baileys'] || 'N/A';
    } catch (e) {
        console.error("No se pudo leer la versión de Baileys desde package.json");
    }

    const botInfo = `╔═══════════════════╗
   *🤖 Información del Bot 🤖*
╚═══════════════════╝

➺ *Nombre:* ${config.botName}
➺ *Fundador:* ${config.ownerName}
➺ *Módulos Activos:* ${commands.size}
➺ *Framework:* @whiskeysockets/baileys ${baileysVersion}
➺ *Estatus:* Disponible ✅
➺ *Alojamiento:* Duluxe Host ⚡ (VIP)`;

    await sock.sendMessage(msg.key.remoteJid, { text: botInfo }, { quoted: msg });
  }
};

export default botCommand;
