import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/blocked.json');

function readBlockedDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeBlockedDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de bloqueados:", error);
  }
}

const unblockCommand = {
  name: "unblock",
  category: "propietario",
  description: "Desbloquea a un usuario.",

  async execute({ sock, msg, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quotedUserJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const userToUnblock = mentionedJid || quotedUserJid;

    if (!userToUnblock) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes mencionar a un usuario o responder a su mensaje para desbloquearlo." }, { quoted: msg });
    }

    let blockedUsers = readBlockedDb();
    if (!blockedUsers.includes(userToUnblock)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este usuario no está bloqueado." }, { quoted: msg });
    }

    blockedUsers = blockedUsers.filter(jid => jid !== userToUnblock);
    writeBlockedDb(blockedUsers);

    const userName = `@${userToUnblock.split('@')[0]}`;
    await sock.sendMessage(msg.key.remoteJid, { text: `✅ Usuario ${userName} ha sido desbloqueado.`, mentions: [userToUnblock] }, { quoted: msg });
  }
};

export default unblockCommand;
