import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/users.json');
const PLAY_REWARD = 10; // Monedas por solo jugar

// Función para leer la base de datos de usuarios
function readUsersDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Función para escribir en la base de datos de usuarios
function writeUsersDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de usuarios:", error);
  }
}

const dadoCommand = {
  name: "dado",
  category: "juegos",
  description: "Lanza un dado de seis caras y gana monedas.",

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

    const results = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const result = results[Math.floor(Math.random() * results.length)];

    await sock.sendMessage(msg.key.remoteJid, { text: `Tu tirada de dado es: ${result}${rewardText}` }, { quoted: msg });
  }
};

export default dadoCommand;
