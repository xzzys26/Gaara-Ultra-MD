import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/blocked.json');

// Función para leer la base de datos de bloqueados
function readBlockedDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para escribir en la base de datos de bloqueados
function writeBlockedDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de bloqueados:", error);
  }
}

const blockCommand = {
  name: "block",
  category: "propietario",
  description: "Bloquea a un usuario para que no pueda usar el bot.",

  async execute({ sock, msg, config }) {
    // Usamos el ID del participante, que puede ser LID o JID
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    // Determinar a quién bloquear (mencionado o en respuesta)
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quotedUserJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const userToBlock = mentionedJid || quotedUserJid;

    if (!userToBlock) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes mencionar a un usuario o responder a su mensaje para bloquearlo." }, { quoted: msg });
    }

    const blockedUsers = readBlockedDb();
    if (blockedUsers.includes(userToBlock)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este usuario ya está bloqueado." }, { quoted: msg });
    }

    blockedUsers.push(userToBlock);
    writeBlockedDb(blockedUsers);

    const userName = `@${userToBlock.split('@')[0]}`;
    await sock.sendMessage(msg.key.remoteJid, { text: `✅ Usuario ${userName} ha sido bloqueado.`, mentions: [userToBlock] }, { quoted: msg });
  }
};

export default blockCommand;
