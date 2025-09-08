import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/users.json');
const PLAY_REWARD = 5;

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

const coinflipCommand = {
  name: "coinflip",
  category: "juegos",
  description: "Lanza una moneda al aire y gana monedas.",
  aliases: ["caraocruz"],

  async execute({ sock, msg }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    let rewardText = "";
    if (user) {
      user.coins += PLAY_REWARD;
      writeUsersDb(usersDb);
      rewardText = `\n\n*+${PLAY_REWARD} coins* por jugar.`;
    }

    const result = Math.random() < 0.5 ? "Cara" : "Cruz";
    const emoji = result === "Cara" ? "🙂" : "❌";

    await sock.sendMessage(msg.key.remoteJid, { text: `La moneda ha caído en: *${result}* ${emoji}${rewardText}` }, { quoted: msg });
  }
};

export default coinflipCommand;
