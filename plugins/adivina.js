import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/users.json');
const PLAY_REWARD = 15;
const WIN_REWARD = 200;

function readUsersDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) { return {}; }
}

function writeUsersDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) { console.error("Error escribiendo en la DB de usuarios:", error); }
}

const adivinaCommand = {
  name: "adivina",
  category: "juegos",
  description: "Adivina el número que estoy pensando (del 1 al 10) y gana monedas.",

  async execute({ sock, msg, args }) {
    const userGuess = parseInt(args[0]);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes adivinar un número del 1 al 10. Ejemplo: `adivina 7`" }, { quoted: msg });
    }

    const botNumber = Math.floor(Math.random() * 10) + 1;

    let message = `Tú elegiste: *${userGuess}*\nYo elegí: *${botNumber}*\n\n`;
    let reward = 0;

    if (userGuess === botNumber) {
      message += "¡Increíble! Adivinaste el número. ¡Ganaste! 🎉";
      reward = PLAY_REWARD + WIN_REWARD;
    } else {
      message += "¡Fallaste! Mejor suerte la próxima vez. 🤖";
      reward = PLAY_REWARD;
    }

    let rewardText = "";
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (user) {
      user.coins += reward;
      writeUsersDb(usersDb);
      rewardText = `\n\n*+${reward} coins*`;
    }

    await sock.sendMessage(msg.key.remoteJid, { text: message + rewardText }, { quoted: msg });
  }
};

export default adivinaCommand;
