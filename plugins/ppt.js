import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/users.json');
const PLAY_REWARD = 10;
const WIN_REWARD = 50;

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

function getEmoji(choice) {
  if (choice === "piedra") return "🗿";
  if (choice === "papel") return "📄";
  if (choice === "tijera") return "✂️";
  return "";
}

const pptCommand = {
  name: "ppt",
  category: "juegos",
  description: "Juega Piedra, Papel o Tijera y gana monedas.",

  async execute({ sock, msg, args }) {
    const choices = ["piedra", "papel", "tijera"];
    const userChoice = args[0]?.toLowerCase();

    if (!userChoice || !choices.includes(userChoice)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Elige: piedra, papel o tijera.\nEjemplo: `ppt piedra`" }, { quoted: msg });
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultText;
    let reward = 0;

    if (userChoice === botChoice) {
      resultText = "¡Es un empate! 🤝";
      reward = PLAY_REWARD;
    } else if (
      (userChoice === "piedra" && botChoice === "tijera") ||
      (userChoice === "papel" && botChoice === "piedra") ||
      (userChoice === "tijera" && botChoice === "papel")
    ) {
      resultText = "¡Ganaste! 🎉";
      reward = PLAY_REWARD + WIN_REWARD;
    } else {
      resultText = "¡Perdiste! 🤖";
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

    const fullMessage = `*Piedra, Papel o Tijera*\n\n` +
                        `Tu elección: ${getEmoji(userChoice)}\n` +
                        `Elección del bot: ${getEmoji(botChoice)}\n\n` +
                        `*Resultado:* ${resultText}${rewardText}`;

    await sock.sendMessage(msg.key.remoteJid, { text: fullMessage }, { quoted: msg });
  }
};

export default pptCommand;
