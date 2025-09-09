import { readUsersDb, writeUsersDb } from '../lib/database.js';

const INITIAL_COINS = 1000;

const registerCommand = {
  name: "reg",
  category: "general",
  description: "Te registra en el sistema del bot. Uso: reg <nombre>.<edad>",
  aliases: ["registrar", "register"],

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();

    if (usersDb[senderId]) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Ya estás registrado." }, { quoted: msg });
    }

    const input = args.join(' ');
    if (!input.includes('.')) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Formato incorrecto. Uso: `reg <nombre>.<edad>`\nEjemplo: `reg Jules.25`" }, { quoted: msg });
    }

    const [name, ageStr] = input.split('.');
    const age = parseInt(ageStr, 10);

    if (!name || isNaN(age) || age < 10 || age > 90) {
        return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un nombre válido y una edad entre 10 y 90 años." }, { quoted: msg });
    }

    usersDb[senderId] = {
      name: name.trim(),
      age: age,
      registeredAt: new Date().toISOString(),
      coins: INITIAL_COINS,
      warnings: 0
    };

    writeUsersDb(usersDb);

    const successMessage = `
╭━━━〔 *✅ Registro Exitoso ✅* 〕━━━╮

➺ *Nombre:* ${name.trim()}
➺ *Edad:* ${age}
➺ *Monedas Iniciales:* ${INITIAL_COINS} coins

➺ ¡Bienvenido/a al sistema del bot!

╰━━━〔 *🔰 Gaara Ultra MD 🔰* 〕━━━╯
`;

    await sock.sendMessage(msg.key.remoteJid, { text: successMessage }, { quoted: msg });
  }
};

export default registerCommand;
