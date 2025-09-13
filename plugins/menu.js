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

// Relación de prefijos → países y zonas horarias
const zonasPorPrefijo = {
  "+52": { pais: "🇲🇽 México", zona: "America/Mexico_City" },
  "+1": { pais: "🇺🇸 EE.UU / Caribe", zona: "America/New_York" }, // incluye RD y St. Martin
  "+504": { pais: "🇭🇳 Honduras", zona: "America/Tegucigalpa" },
  "+57": { pais: "🇨🇴 Colombia", zona: "America/Bogota" },
  "+58": { pais: "🇻🇪 Venezuela", zona: "America/Caracas" },
  "+51": { pais: "🇵🇪 Perú", zona: "America/Lima" },
  "+1809": { pais: "🇩🇴 República Dominicana", zona: "America/Santo_Domingo" },
  "+1829": { pais: "🇩🇴 República Dominicana", zona: "America/Santo_Domingo" },
  "+1849": { pais: "🇩🇴 República Dominicana", zona: "America/Santo_Domingo" },
  "+590": { pais: "🇸🇽 Saint Martin", zona: "America/Marigot" }
};

// Obtener saludo y hora según prefijo
function getSaludoYHora(jid) {
  const numero = jid.split("@")[0];
  let data = null;

  for (const prefijo of Object.keys(zonasPorPrefijo)) {
    if (numero.startsWith(prefijo.replace("+", ""))) {
      data = zonasPorPrefijo[prefijo];
      break;
    }
  }

  if (!data) {
    // Si no se reconoce, usar Saint Martin como default
    data = { pais: "🌍 Desconocido", zona: "America/Marigot" };
  }

  const ahora = new Date();
  const hora = new Intl.DateTimeFormat("es-ES", {
    timeZone: data.zona,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(ahora);

  const hora24 = parseInt(new Intl.DateTimeFormat("es-ES", {
    timeZone: data.zona,
    hour: "2-digit",
    hour12: false
  }).format(ahora));

  let saludo = "🌃 Buenas noches";
  if (hora24 >= 5 && hora24 < 12) saludo = "🌄 Buenos días";
  else if (hora24 >= 12 && hora24 < 19) saludo = "🌆 Buenas tardes";

  return `${saludo} ${data.pais} — *${hora}*`;
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
      await sock.sendMessage(msg.key.remoteJid, { react: { text: "🥷🏽", key: msg.key } });
      await sleep(700);
      await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅️", key: msg.key } });
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

    // Uptime, fecha y saludo según país del número
    const uptime = formatUptime(process.uptime() * 1000);
    const fecha = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Marigot"
    });
    const saludo = getSaludoYHora(msg.key.remoteJid);

    // Encabezado del menú
    let menuText = `╭━━━〔 *${config.botName}* 〕━━━⬣\n`;
    menuText += `┃ ➪ 🥷🏼 Hola: *${msg.pushName}*\n`;
    menuText += `┃ ➪ 👑 Owner: *${config.ownerName}*\n`;
    menuText += `┃ ➪ 🔰 Versión: *${config.version || '4.1.0'}*\n`;
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

    const gifUrl = 'https://files.catbox.moe/calbdy.mp4';

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