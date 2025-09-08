import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/warnings.json');

// Función para leer la base de datos
function readDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Función para escribir en la base de datos
function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de advertencias:", error);
  }
}

const unwarnCommand = {
  name: "unwarn",
  category: "grupos",
  description: "Quita una advertencia a un usuario.",

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const senderIsAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin;
      if (!senderIsAdmin) {
        return sock.sendMessage(from, { text: "No tienes permisos de administrador para usar este comando." }, { quoted: msg });
      }

      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quotedUserJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const userToUnwarn = mentionedJid || quotedUserJid;

      if (!userToUnwarn) {
        return sock.sendMessage(from, { text: "Debes mencionar a un usuario o responder a su mensaje." }, { quoted: msg });
      }

      const db = readDb();
      if (!db[from] || !db[from][userToUnwarn] || db[from][userToUnwarn] === 0) {
        return sock.sendMessage(from, { text: "Este usuario no tiene advertencias." }, { quoted: msg });
      }

      db[from][userToUnwarn]--;
      const newWarnCount = db[from][userToUnwarn];
      writeDb(db);

      const userName = `@${userToUnwarn.split('@')[0]}`;
      const message = `*✅ ADVERTENCIA REMOVIDA ✅*\n\n` +
                      `*Usuario:* ${userName}\n` +
                      `*Advertencias ahora:* ${newWarnCount}`;

      await sock.sendMessage(from, { text: message, mentions: [userToUnwarn] });

    } catch (e) {
      console.error("Error en el comando unwarn:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al procesar el comando." }, { quoted: msg });
    }
  }
};

export default unwarnCommand;
