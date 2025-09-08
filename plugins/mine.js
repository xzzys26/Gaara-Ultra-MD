import { readUsersDb, writeUsersDb } from '../lib/database.js';

const mineCommand = {
  name: "mine",
  category: "economia",
  description: "Usa tu pico para minar gemas y conseguir monedas. Requiere un 'Pico de Hierro'.",
  aliases: ["minar"],

  async execute({ sock, msg }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];
    const COOLDOWN_MS = 7 * 60 * 1000; // 7 minutos

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    // Verificar si el usuario tiene un pico
    if (!user.inventory || !user.inventory.pico || user.inventory.pico < 1) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Necesitas un 'Pico de Hierro' para usar este comando. Cómpralo en la tienda con `buy pico`." }, { quoted: msg });
    }

    const lastMine = user.lastMine || 0;
    const now = Date.now();

    if (now - lastMine < COOLDOWN_MS) {
      const timeLeft = COOLDOWN_MS - (now - lastMine);
      const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
      return sock.sendMessage(msg.key.remoteJid, { text: `Debes esperar ${minutesLeft} minutos más para volver a minar.` }, { quoted: msg });
    }

    const earnings = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

    user.coins = (user.coins || 0) + earnings;
    user.lastMine = now;

    writeUsersDb(usersDb);

    const mineMessages = [
        `¡Encontraste una veta de cuarzo! La vendiste por ${earnings} coins.`,
        `¡Una geoda! Dentro había ${earnings} coins.`,
        `Picaste todo el día para conseguir ${earnings} coins.`,
        `¡Un rubí! Lo vendiste a un coleccionista por ${earnings} coins.`
    ];
    const message = mineMessages[Math.floor(Math.random() * mineMessages.length)];

    await sock.sendMessage(msg.key.remoteJid, { text: `⛏️ ${message}\n*Nuevo saldo:* ${user.coins} coins` }, { quoted: msg });
  }
};

export default mineCommand;
