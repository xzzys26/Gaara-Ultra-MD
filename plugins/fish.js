import { readUsersDb, writeUsersDb } from '../lib/database.js';

const fishCommand = {
  name: "fish",
  category: "economia",
  description: "Usa tu caña de pescar para conseguir monedas. Requiere una 'Caña de Pescar'.",
  aliases: ["pescar"],

  async execute({ sock, msg }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];
    const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    // Verificar si el usuario tiene una caña de pescar
    if (!user.inventory || !user.inventory.pesca || user.inventory.pesca < 1) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Necesitas una 'Caña de Pescar' para usar este comando. Cómprala en la tienda con `buy pesca`." }, { quoted: msg });
    }

    const lastFish = user.lastFish || 0;
    const now = Date.now();

    if (now - lastFish < COOLDOWN_MS) {
      const timeLeft = COOLDOWN_MS - (now - lastFish);
      const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
      return sock.sendMessage(msg.key.remoteJid, { text: `Debes esperar ${minutesLeft} minutos más para volver a pescar.` }, { quoted: msg });
    }

    const earnings = Math.floor(Math.random() * (75 - 10 + 1)) + 10;

    // No hay impuestos para la pesca, es una ganancia menor.
    user.coins = (user.coins || 0) + earnings;
    user.lastFish = now;

    writeUsersDb(usersDb);

    const fishMessages = [
        `¡Atrapaste una bota vieja! Pero encontraste ${earnings} coins dentro.`,
        `¡Un pez dorado! Se vendió por ${earnings} coins.`,
        `Pescaste un cofre pequeño con ${earnings} coins dentro.`,
        `Una captura tranquila, pero valió ${earnings} coins.`
    ];
    const message = fishMessages[Math.floor(Math.random() * fishMessages.length)];

    await sock.sendMessage(msg.key.remoteJid, { text: `🎣 ${message}\n*Nuevo saldo:* ${user.coins} coins` }, { quoted: msg });
  }
};

export default fishCommand;
