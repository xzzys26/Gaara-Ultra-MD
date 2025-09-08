import { readUsersDb, writeUsersDb } from '../lib/database.js';

const giveCommand = {
  name: "give",
  category: "economia",
  description: "Transfiere monedas a otro usuario.",
  aliases: ["dar", "transferir"],

  async execute({ sock, msg, args, config }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const senderUser = usersDb[senderId];

    if (!senderUser) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa `reg` para registrarte." }, { quoted: msg });
    }

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentionedJid) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes mencionar a un usuario para transferirle monedas. Ejemplo: `give @usuario 100`" }, { quoted: msg });
    }

    const targetUser = usersDb[mentionedJid];
    if (!targetUser) {
      return sock.sendMessage(msg.key.remoteJid, { text: "El usuario mencionado no está registrado." }, { quoted: msg });
    }

    if (senderId === mentionedJid) {
        return sock.sendMessage(msg.key.remoteJid, { text: "No puedes darte monedas a ti mismo." }, { quoted: msg });
    }

    const amount = parseInt(args.find(arg => !arg.startsWith('@')));
    if (isNaN(amount) || amount <= 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, introduce una cantidad válida para transferir." }, { quoted: msg });
    }

    if (senderUser.coins < amount) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No tienes suficientes monedas. Saldo actual: ${senderUser.coins}` }, { quoted: msg });
    }

    const tax = Math.floor(amount * config.taxRate);
    const netAmount = amount - tax;

    senderUser.coins -= amount;
    targetUser.coins += netAmount;

    writeUsersDb(usersDb);

    const giveMessage = `✅ Has transferido *${amount} coins* a *${targetUser.name}*.\n` +
                        `💸 Se aplicó un impuesto de ${config.taxRate * 100}% (*${tax} coins*).\n` +
                        `💰 *${targetUser.name}* recibió *${netAmount} coins*.\n\n` +
                        `Tu nuevo saldo: ${senderUser.coins} coins.`;

    await sock.sendMessage(msg.key.remoteJid, { text: giveMessage, contextInfo: { mentionedJid: [mentionedJid] } }, { quoted: msg });
  }
};

export default giveCommand;
