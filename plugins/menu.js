// Mapa de emojis para las categorías
const categoryEmojis = {
  'general': 'ℹ️',
  'descargas': '📥',
  'diversion': '🎉',
  'juegos': '🎮',
  'grupos': '👥',
  'propietario': '👑',
  'utilidades': '🛠️',
  'informacion': '📚',
  'subbots': '🤖',
  'ias': '🧠',
  'default': '⚙️'
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
    let menuText = `╭━━━〔 *${config.botName}* 〕━━╮\n`;
    menuText += `┃ ➪ ʜᴏʟᴀ ᴜsᴇʀ : *${msg.pushName}*\n`;
    menuText += `┃ ➪ ᴠᴇʀsɪᴏɴ ᴅᴇʟ ʙᴏᴛ : *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➪ ᴏᴡɴᴇʀ x ᴄʀᴇᴀᴅᴏʀ : *${config.ownerName}*\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index) // evitar duplicados
        .map(cmd => `┃ ➺ ${cmd.name}`)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: 'https://russellxz.click/c02f8044.jpeg' },
        caption: menuText,
        mimetype: 'image/png'
      },
      { quoted: msg }
    );
  }
};

export default menuCommand;