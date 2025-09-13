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

// Función para formatear uptime
function formatUptime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  return `${hours}h ${minutes}m ${seconds}s`;
}

// Función de delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para saludo según hora
function getSaludo() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '🌄 Buenos días';
  if (hour >= 12 && hour < 18) return '🌆 Buenas tardes';
  return '🌃 Buenas noches';
}

const menuCommand = {
  name: "menu",
  category: "general",
  description: "Muestra el menú de comandos del bot.",
  aliases: ["help", "ayuda"],

  async execute({ sock, msg, commands, config }) {
    const categories = {};

    // --- Reacciones al mensaje ---
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🥷🏽", key: msg.key }
      });

      await sleep(700); // espera 700ms antes de la segunda reacción

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "✅️", key: msg.key }
      });
    } catch (err) {
      console.log("No se pudo reaccionar al mensaje:", err);
    }

    // Agrupar comandos por categoría
    commands.forEach(command => {
      if (!command.category || command.name === 'test') return;
      if (!categories[command.category]) categories[command.category] = [];
      categories[command.category].push(command);
    });

    const sortedCategories = Object.keys(categories).sort();

    // Uptime y fecha
    const uptime = formatUptime(process.uptime() * 1000);
    const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const saludo = getSaludo();

    // Encabezado del menú
    let menuText = `╭━━━〔 *${config.botName}* 〕━━━⬣\n`;
    menuText += `┃ ➪ 🥷🏼 Hola: *${msg.pushName}*\n`;
    menuText += `┃ ➪ 👑 Owner: *${config.ownerName}*\n`;
    menuText += `┃ ➪ 🔰 Versión: *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➪ ⏰ Uptime: *${uptime}*\n`;
    menuText += `┃ ➪ 📅 Fecha: *${fecha}*\n`;
    menuText += `┃ ➪ ${saludo}\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    // Construcción del menú
    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕━━━⬣\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index)
        .map(cmd => `> ╰┈➤ ⚡︎ \`\`\`.${cmd.name}\`\`\``)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }

const gifUrl = 'https://files.catbox.moe/32tule.mp4';

await sock.sendMessage(
  msg.key.remoteJid,
  {
    video: { url: gifUrl },
    caption: menuText,
    mimetype: 'video/mp4',
    gifPlayback: true 
  },
  { quoted: msg }
 );
  }
};

export default menuCommand;