import { readUsersDb, writeUsersDb } from '../lib/database.js';

const crimeCommand = {
  name: "crime",
  category: "economia",
  description: "Comete un crimen para ganar (o perder) monedas. Mayor riesgo, mayor recompensa.",

  async execute({ sock, msg, config }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];
    const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 horas
    const SUCCESS_CHANCE = 0.5; // 50%
    const PENALTY_AMOUNT = 250;

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    const lastCrime = user.lastCrime || 0;
    const now = Date.now();

    if (now - lastCrime < COOLDOWN_MS) {
      const timeLeft = COOLDOWN_MS - (now - lastCrime);
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.ceil((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return sock.sendMessage(msg.key.remoteJid, { text: `Debes esperar ${hoursLeft}h y ${minutesLeft}m para volver a delinquir.` }, { quoted: msg });
    }

    user.lastCrime = now; // Actualizar cooldown

    if (Math.random() < SUCCESS_CHANCE) {
      // Éxito
      const earnings = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
      const tax = Math.floor(earnings * config.taxRate);
      const netEarnings = earnings - tax;

      user.coins += netEarnings;
      writeUsersDb(usersDb);
      const successMessages = [
        `Robaste un banco y escapaste con ${earnings} coins.`,
        `Hackeaste una cuenta de criptomonedas y obtuviste ${earnings} coins.`,
        `Realizaste un atraco exitoso y te llevaste ${earnings} coins.`
      ];
      const message = successMessages[Math.floor(Math.random() * successMessages.length)];
      const taxMessage = `\n💸 Se dedujo un impuesto del ${config.taxRate * 100}% (*${tax} coins*).\n💰 Ganancia neta: *${netEarnings} coins*.`;
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ *¡Éxito!* ${message}${taxMessage}\n\n*Nuevo saldo:* ${user.coins} coins` }, { quoted: msg });
    } else {
      // Fracaso
      user.coins = Math.max(0, user.coins - PENALTY_AMOUNT);
      writeUsersDb(usersDb);
      const failMessages = [
        `Intentaste robar una tienda pero te atraparon. Pagaste ${PENALTY_AMOUNT} coins de multa.`,
        `Tu hackeo falló y tuviste que pagar ${PENALTY_AMOUNT} coins para cubrir tus huellas.`,
        `La policía te detuvo en medio del atraco. Perdiste ${PENALTY_AMOUNT} coins.`
      ];
      const message = failMessages[Math.floor(Math.random() * failMessages.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ *¡Fracaso!* ${message}\n*Nuevo saldo:* ${user.coins} coins` }, { quoted: msg });
    }
  }
};

export default crimeCommand;
