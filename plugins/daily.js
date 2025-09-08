import { readUsersDb, writeUsersDb } from '../lib/database.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas
const DAILY_REWARD = 1000;

const dailyCommand = {
  name: "daily",
  category: "economia",
  description: "Reclama tu recompensa diaria de monedas.",
  aliases: ["diario"],

  async execute({ sock, msg, config }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    const lastDaily = user.lastDaily || 0;
    const now = Date.now();

    if (now - lastDaily < COOLDOWN_MS) {
      const timeLeft = COOLDOWN_MS - (now - lastDaily);
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.ceil((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return sock.sendMessage(msg.key.remoteJid, { text: `Ya reclamaste tu recompensa diaria. Vuelve en ${hoursLeft} horas y ${minutesLeft} minutos.` }, { quoted: msg });
    }

    const tax = Math.floor(DAILY_REWARD * config.taxRate);
    const netReward = DAILY_REWARD - tax;

    user.coins = (user.coins || 0) + netReward;
    user.lastDaily = now;

    writeUsersDb(usersDb);

    const dailyMessage = `🎉 ¡Has reclamado tu recompensa diaria de *${DAILY_REWARD} coins*!\n` +
                         `💸 Se dedujo un impuesto del ${config.taxRate * 100}% (*${tax} coins*).\n` +
                         `💰 Ganancia neta: *${netReward} coins*.\n` +
                         `🏦 Tu nuevo saldo es *${user.coins} coins*.`;
    await sock.sendMessage(msg.key.remoteJid, { text: dailyMessage }, { quoted: msg });
  }
};

export default dailyCommand;
