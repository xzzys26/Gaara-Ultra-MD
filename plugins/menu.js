// Mapa de emojis para las categorías
const categoryEmojis = {
  '*GENERAL*': '📜',
  '*DESCARGAS*: '📥',
  '*DIVERSION*: '🧸',
  '*JUEGOS*': '🎮',
  '*GRUPOS*': '👥',
  '*PROPIETARIO*: '👑',
  '*HERRAMIENTAS*: '🛠️',
  '*INFORMACION*: '📚',
  '*SUB-BOTS*': '🤖',
  '*GAARA-IA*': '🧠',
  '*OTROS CMDS*': '⚙️'
};

const menuCommand = {
  name: "menu",
  category: "general",
  description: "Muestra el menú de comandos del bot.",
  aliases: ["help", "ayuda"],

  async execute({ sock, msg, commands, config }) {
    const categories = {};

    // Agrupar comandos por categoría
    commands.forEach(command => {
      if (!command.category || command.name === 'test') return;

      if (!categories[command.category]) {
        categories[command.category] = [];
      }

      categories[command.category].push(command);
    });

    // Ordenar categorías alfabéticamente
    const sortedCategories = Object.keys(categories).sort();

    // --- Construcción del menú con tu decoración ---
    let menuText = `╭━━━〔 𝙂𝘼𝘼𝙍𝘼 𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🩸 〕━━━╮\n`;
    menuText += `┃ ➟ Hola Mortal: *${msg.pushName}*\n`;
    menuText += `┃ ➟ Versión: *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➟ Owner: *${config.ownerName}*\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭─〔 ${emoji} ${category.toUpperCase()} 〕\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index) // evitar duplicados
        .map(cmd => `┃ ➺ ${cmd.name}`)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    menuText += `╭━━━〔 👑 𝗜𝗡𝗧𝗥𝗢 𝗙𝗜𝗡𝗔𝗟 〕━━━╮\n`;
    menuText += `┃ ➺ Bot creado por: *${config.ownerName}*\n`;
    menuText += `┃ ➺ Disfruta de : 𝙂𝘼𝘼𝙍𝘼 𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🩸 \n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: 'https://files.catbox.moe/vm9t7c.jpg' },
        caption: menuText,
        mimetype: 'image/png'
      },
      { quoted: msg }
    );
  }
};

export default menuCommand;