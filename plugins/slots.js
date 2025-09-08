import { readUsersDb, writeUsersDb } from '../lib/database.js';

const slotsCommand = {
  name: "slots",
  category: "economia",
  description: "Juega a la máquina tragamonedas. Uso: slots <cantidad>",
  aliases: ["slot"],

  async execute({ sock, msg, args, config }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, introduce una cantidad válida para apostar." }, { quoted: msg });
    }

    if (user.coins < bet) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No tienes suficientes monedas para apostar. Saldo actual: ${user.coins}` }, { quoted: msg });
    }

    const emojis = ["🍒", "🍋", "🍊", "🍉", "🍇", "💎"];
    const results = [
      emojis[Math.floor(Math.random() * emojis.length)],
      emojis[Math.floor(Math.random() * emojis.length)],
      emojis[Math.floor(Math.random() * emojis.length)]
    ];

    const resultString = `[ ${results.join(" | ")} ]`;
    let winAmount = 0;
    let tax = 0;
    let netWin = 0;
    let winMessage = "";

    if (results[0] === results[1] && results[1] === results[2]) {
      // 3 of a kind
      winAmount = bet * 10;
      tax = Math.floor(winAmount * config.taxRate);
      netWin = winAmount - tax;
      winMessage = `¡JACKPOT! ¡Has ganado ${winAmount} coins! 🎉\n(Impuesto: ${tax} coins)`;
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
      // 2 of a kind
      winAmount = bet * 2;
      tax = Math.floor(winAmount * config.taxRate);
      netWin = winAmount - tax;
      winMessage = `¡Dos iguales! ¡Has ganado ${winAmount} coins!\n(Impuesto: ${tax} coins)`;
    } else {
      // No win
      netWin = -bet; // La pérdida es la apuesta completa
      winMessage = `¡Mala suerte! Has perdido ${bet} coins.`;
    }

    user.coins += netWin;
    writeUsersDb(usersDb);

    const finalMessage = `🎰 *Tragamonedas* 🎰\n\n${resultString}\n\n${winMessage}\n\n*Nuevo saldo:* ${user.coins} coins`;
    await sock.sendMessage(msg.key.remoteJid, { text: finalMessage }, { quoted: msg });
  }
};

export default slotsCommand;
