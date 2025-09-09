// Mapa de emojis para las categorías
const categoryEmojis = {
  '𝐠𝐞𝐧𝐞𝐫𝐚𝐥': 'ℹ️',
  '𝐝𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬': '📥',
  '𝐝𝐢𝐯𝐞𝐫𝐬𝐢𝐨𝐧': '🎉',
  '𝐣𝐮𝐞𝐠𝐨𝐬': '🎮',
  '𝐠𝐫𝐮𝐩𝐨𝐬': '👥',
  '𝐩𝐫𝐨𝐩𝐢𝐞𝐭𝐚𝐫𝐢𝐨𝐬': '👑',
  '𝐡𝐞𝐫𝐫𝐚𝐦𝐢𝐞𝐧𝐭𝐚𝐬': '🛠️',
  '𝐢𝐧𝐟𝐨𝐫𝐦𝐜𝐢𝐨𝐧': '📚',
  '𝐬𝐮𝐛𝐛𝐨𝐭𝐬': '🤖',
  '𝐢𝐚𝐬': '🧠',
  '𝐨𝐭𝐫𝐨𝐬': '⚙️'
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
    let menuText = `╭━━━〔 *${config.botName}* 〕━━━╮\n`;
    menuText += `┃ ➪ ʜᴏʟᴀ: *${msg.pushName}*\n`;
    menuText += `┃ ➪ ᴠᴇʀsɪᴏɴ: *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➪ ᴏᴡɴᴇʀ: *${config.ownerName}*\n`;
                 ┃ ➪ ᴀᴄᴛɪᴠᴏ: ${uptime}
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index) // evitar duplicados
        .map(cmd => `┃ ➺ ${cmd.name}`)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    menuText += `╭━━━〔 👑 INFO FINAL 〕━━━╮\n`;
    menuText += `┃ ➺ Bot creado por: *${config.ownerName}*\n`;
    menuText += `┃ ➺ Disfruta de *${config.botName}* 🚀\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: 'https://files.catbox.moe/itgz1x.png' },
        caption: menuText,
        mimetype: 'image/png'
      },
      { quoted: msg }
    );
  }
};

export default menuCommand;