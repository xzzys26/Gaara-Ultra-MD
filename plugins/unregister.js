import { readUsersDb, writeUsersDb } from '../lib/database.js';

const unregisterCommand = {
  name: "unreg",
  category: "general",
  description: "Elimina tu registro del sistema del bot.",
  aliases: ["unregister"],

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();

    if (!usersDb[senderId]) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado." }, { quoted: msg });
    }

    // El comando requiere un número de serie para confirmar, por seguridad.
    // El número de serie puede ser parte del nombre de usuario o un ID único.
    // Por simplicidad, usaremos los últimos 4 dígitos del número de teléfono.
    const serialNumber = senderId.substring(senderId.length - 8, senderId.length - 4);
    const confirmation = args[0];

    if (confirmation !== serialNumber) {
        return sock.sendMessage(msg.key.remoteJid, {
            text: "⚠️ *Confirmación Requerida* ⚠️\n\n" +
                  "Para eliminar tu registro, debes confirmar con tu número de serie único.\n" +
                  `Usa el comando: \`unreg ${serialNumber}\``
        }, { quoted: msg });
    }

    delete usersDb[senderId];
    writeUsersDb(usersDb);

    await sock.sendMessage(msg.key.remoteJid, { text: "✅ Has eliminado tu registro exitosamente. Todos tus datos han sido borrados." }, { quoted: msg });
  }
};

export default unregisterCommand;
