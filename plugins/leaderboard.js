import { readUsersDb } from '../lib/database.js';

const leaderboardCommand = {
  name: "leaderboard",
  category: "economia",
  description: "Muestra la tabla de clasificación de los usuarios más ricos.",
  aliases: ["lb", "top"],

  async execute({ sock, msg }) {
    const usersDb = readUsersDb();
    const users = Object.values(usersDb);

    if (users.length === 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No hay usuarios registrados para mostrar en la clasificación." }, { quoted: msg });
    }

    // Ordenar usuarios por monedas en orden descendente
    users.sort((a, b) => (b.coins || 0) - (a.coins || 0));

    const topUsers = users.slice(0, 10);

    let leaderboardMessage = "🏆 *Tabla de Clasificación Global* 🏆\n\n";
    topUsers.forEach((user, index) => {
      leaderboardMessage += `${index + 1}. *${user.name}* - ${user.coins || 0} coins\n`;
    });

    await sock.sendMessage(msg.key.remoteJid, { text: leaderboardMessage }, { quoted: msg });
  }
};

export default leaderboardCommand;
