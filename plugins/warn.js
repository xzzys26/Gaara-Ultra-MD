import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database/warnings.json');
const MAX_WARNINGS = 3;

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

const warnCommand = {
  name: "warn",
  category: "grupos",
  description: `Advierte a un usuario. Al llegar a ${MAX_WARNINGS} advertencias, es expulsado.`,

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      // Solo admins pueden advertir
      const senderIsAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin;
      if (!senderIsAdmin) {
        return sock.sendMessage(from, { text: "No tienes permisos de administrador para usar este comando." }, { quoted: msg });
      }

      // El bot debe ser admin para poder expulsar
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botIsAdmin = metadata.participants.find(p => p.id === botJid)?.admin;
       if (!botIsAdmin) {
        return sock.sendMessage(from, { text: "Necesito ser administrador para poder aplicar advertencias y expulsar." }, { quoted: msg });
      }

      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quotedUserJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const userToWarn = mentionedJid || quotedUserJid;

      if (!userToWarn) {
        return sock.sendMessage(from, { text: "Debes mencionar a un usuario o responder a su mensaje para advertirle." }, { quoted: msg });
      }

      if (userToWarn === botJid) {
        return sock.sendMessage(from, { text: "No me puedo advertir a mí mismo." }, { quoted: msg });
      }

      const db = readDb();
      if (!db[from]) {
        db[from] = {};
      }
      if (!db[from][userToWarn]) {
        db[from][userToWarn] = 0;
      }

      db[from][userToWarn]++;
      const newWarnCount = db[from][userToWarn];
      writeDb(db);

      const userName = `@${userToWarn.split('@')[0]}`;
      let message = `*⚠️ ADVERTENCIA ⚠️*\n\n` +
                    `*Usuario:* ${userName}\n` +
                    `*Advertencias:* ${newWarnCount}/${MAX_WARNINGS}\n\n` +
                    `_Por favor, sigue las reglas del grupo._`;

      if (newWarnCount >= MAX_WARNINGS) {
        message += `\n\n*¡LÍMITE ALCANZADO!* El usuario será eliminado del grupo.`;
        await sock.sendMessage(from, { text: message, mentions: [userToWarn] });
        // Esperar un poco para que el mensaje se vea antes de expulsar
        setTimeout(async () => {
          await sock.groupParticipantsUpdate(from, [userToWarn], "remove");
        }, 2000);
      } else {
        await sock.sendMessage(from, { text: message, mentions: [userToWarn] });
      }

    } catch (e) {
      console.error("Error en el comando warn:", e);
      await sock.sendMessage(from, { text: "Ocurrió un error al procesar la advertencia." }, { quoted: msg });
    }
  }
};

export default warnCommand;
