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
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Ya estás registrado." }, { quoted: msg });
    }

    const input = args.join(' ');
    if (!input.includes('.')) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Formato incorrecto.\nUso: `reg <nombre>.<edad>`\nEjemplo: `reg Jules.25`" },
        { quoted: msg }
      );
    }

    const [name, ageStr] = input.split('.');
    const age = parseInt(ageStr, 10);

    if (!name || isNaN(age) || age < 10 || age > 90) {
      return sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Ingresa un nombre válido y una edad entre 10 y 90 años." },
        { quoted: msg }
      );
    }

    // Loader 1
    const loader = await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Un momento, por favor..." }, { quoted: msg });

    // Loader 2
    setTimeout(async () => {
      await sock.sendMessage(msg.key.remoteJid, { text: "🗂 Registrándote en mi base de datos...", edit: loader.key });
    }, 2500);

    // Loader 3
    setTimeout(async () => {
      await sock.sendMessage(msg.key.remoteJid, { text: "✅️ ¡Ya estás listo!", edit: loader.key });
    }, 5000);

    // Mensaje final con botón (mensaje NUEVO)
    setTimeout(async () => {
      usersDb[senderId] = {
        name: name.trim(),
        age: age,
        registeredAt: new Date().toISOString(),
        coins: INITIAL_COINS,
        warnings: 0
      };

      writeUsersDb(usersDb);

      const successMessage = `
🎉 *Registro Completado con Éxito* 🎉

👤 Nombre: ${name.trim()}
🎂 Edad: ${age}
💰 Monedas Iniciales: ${INITIAL_COINS}

🔰 ¡Bienvenido/a al sistema del bot!
      `;

      // Botón para volver al menú
      const buttons = [
        { buttonId: 'menu', buttonText: { displayText: '🔙 Volver al Menú' }, type: 1 }
      ];

      await sock.sendMessage(msg.key.remoteJid, {
        text: successMessage.trim(),
        footer: '🌀 Gaara Ultra MD',
        buttons: buttons,
        headerType: 1
      }, { quoted: msg });

    }, 7000);
  }
};

export default registerCommand;