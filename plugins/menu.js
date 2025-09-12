const menuCommand = {
  name: "menu",
  category: "general",
  description: "Muestra el menú de comandos del bot.",
  aliases: ["help", "ayuda"],

  async execute({ sock, msg, commands, config }) {
    const categories = {};

    // --- Reacción al mensaje ---
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🌀", key: msg.key } // Aquí cambias el emoji de reacción
      });
    } catch (err) {
      console.log("No se pudo reaccionar al mensaje:", err);
    }

    // --- Agrupar comandos por categoría ---
    commands.forEach(command => {
      if (!command.category || command.name === 'test') return;

      if (!categories[command.category]) {
        categories[command.category] = [];
      }

      categories[command.category].push(command);
    });

    const sortedCategories = Object.keys(categories).sort();

    // --- Uptime y hora ---
    const uptime = formatUptime(process.uptime() * 1000);
    const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const hora = getHora("America/Bogota");

    // --- Construcción del menú ---
    let menuText = `╭━━━〔 *${config.botName}* 〕━━━⬣\n`;
    menuText += `┃ ➪ ⚡️ 𝗛𝗼𝗹𝗮: *${msg.pushName}*\n`;
    menuText += `┃ ➪ 👑 Owner: *${config.ownerName}*\n`;
    menuText += `┃ ➪ 📦 Versión: *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➪ ⏰ Uptime: *${uptime}*\n`;
    menuText += `┃ ➪ 📅 Fecha: *${fecha}*\n`;
    menuText += `┃ ➪ 🕒 Hora: *${hora}*\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕━━━⬣\n`;
      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index)
        .map(cmd => `> ╰┈➤ :: \`\`\`.${cmd.name}\`\`\``)
        .join('\n');
      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }

    await sock.sendMessage(
      msg.key.remoteJid,
      { image: { url: 'https://files.catbox.moe/vm9t7c.jpg' }, caption: menuText, mimetype: 'image/png' },
      { quoted: msg }
    );
  }
};