import { readUsersDb, writeUsersDb } from '../lib/database.js';

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 horas
const SUCCESS_CHANCE = 0.4; // 40% de éxito
const PENALTY_AMOUNT = 150;

const robCommand = {
  name: "rob",
  category: "economia",
  description: "Intenta robar monedas a otro usuario. ¡Cuidado, puedes fallar!",
  aliases: ["robar"],

  async execute({ sock, msg, config }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const robber = usersDb[senderId];

    if (!robber) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa `reg` para registrarte." }, { quoted: msg });
    }

    const lastRob = robber.lastRob || 0;
    const now = Date.now();
    if (now - lastRob < COOLDOWN_MS) {
        const timeLeft = COOLDOWN_MS - (now - lastRob);
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.ceil((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return sock.sendMessage(msg.key.remoteJid, { text: `Debes esperar ${hoursLeft}h y ${minutesLeft}m para volver a robar.` }, { quoted: msg });
    }

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentionedJid) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes mencionar a un usuario para robarle. Ejemplo: `rob @usuario`" }, { quoted: msg });
    }

    const victim = usersDb[mentionedJid];
    if (!victim) {
      return sock.sendMessage(msg.key.remoteJid, { text: "El usuario mencionado no está registrado." }, { quoted: msg });
    }

    if (senderId === mentionedJid) {
        return sock.sendMessage(msg.key.remoteJid, { text: "No puedes robarte a ti mismo." }, { quoted: msg });
    }

    if ((victim.coins || 0) < PENALTY_AMOUNT) {
        return sock.sendMessage(msg.key.remoteJid, { text: "La víctima es demasiado pobre, no vale la pena el riesgo." }, { quoted: msg });
    }

    robber.lastRob = now; // Actualizar cooldown independientemente del resultado

    // Verificar si hay efectos activos
    let currentSuccessChance = SUCCESS_CHANCE;
    let luckActive = false;
    if (robber.effects?.suerte && robber.effects.suerte > Date.now()) {
      currentSuccessChance = 0.6; // Aumentar la probabilidad de éxito al 60%
      luckActive = true;
    } else if (robber.effects?.suerte) {
      delete robber.effects.suerte; // Limpiar efecto expirado
    }

    if (Math.random() < currentSuccessChance) {
      // Éxito
      const stolenPercentage = Math.random() * (0.3 - 0.1) + 0.1; // Roba entre 10% y 30%
      const stolenAmount = Math.floor(victim.coins * stolenPercentage);
      const tax = Math.floor(stolenAmount * config.taxRate);
      const netStolen = stolenAmount - tax;

      robber.coins += netStolen;
      victim.coins -= stolenAmount; // La víctima pierde el monto total

      writeUsersDb(usersDb);

      let successMessage = `🚨 ¡Robo exitoso! 🚨\n\nLe has robado *${stolenAmount} coins* a *${victim.name}*.\n` +
                           `💸 Se dedujo un impuesto del ${config.taxRate * 100}% (*${tax} coins*).\n` +
                           `💰 Ganancia neta: *${netStolen} coins*.`;

      if (luckActive) {
        successMessage += "\n\n✨ *¡Tu Poción de Suerte te ha ayudado!*";
      }

      await sock.sendMessage(msg.key.remoteJid, { text: successMessage, contextInfo: { mentionedJid: [mentionedJid] } }, { quoted: msg });

    } else {
      // Fracaso
      robber.coins = Math.max(0, robber.coins - PENALTY_AMOUNT);
      writeUsersDb(usersDb);

      const failMessage = `🚓 ¡Te atraparon! 🚓\n\nFallaste el robo y perdiste *${PENALTY_AMOUNT} coins* como multa.`;
      await sock.sendMessage(msg.key.remoteJid, { text: failMessage }, { quoted: msg });
    }
  }
};

export default robCommand;
