import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/warnings.json');

// Función para leer la base de datos
function readDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

const warnlistCommand = {
  name: "warnlist",
  category: "grupos",
  description: "Muestra la lista de usuarios con advertencias.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const db = readDb();
      const groupWarnings = db[from];

      if (!groupWarnings || Object.keys(groupWarnings).length === 0) {
        return sock.sendMessage(from, { text: "No hay advertencias en este grupo." }, { quoted: msg });
      }

      let message = "*📋 Lista de Advertencias del Grupo 📋*\n\n";
      let mentions = [];

      for (const userId in groupWarnings) {
        if (groupWarnings[userId] > 0) {
          const warnCount = groupWarnings[userId];
          const userName = `@${userId.split('@')[0]}`;
          message += `• ${userName}: *${warnCount}* advertencia(s)\n`;
          mentions.push(userId);
        }
      }

      if (mentions.length === 0) {
          return sock.sendMessage(from, { text: "No hay advertencias activas en este grupo." }, { quoted: msg });
      }

      await sock.sendMessage(from, { text: message, mentions: mentions }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando warnlist:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al obtener la lista de advertencias." }, { quoted: msg });
    }
  }
};

export default warnlistCommand;
