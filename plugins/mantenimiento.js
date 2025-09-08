import { readMaintenanceDb, writeMaintenanceDb } from '../lib/database.js';

const mantenimientoCommand = {
  name: "mantenimiento",
  category: "propietario",
  description: "Pone un comando en modo de mantenimiento.",

  async execute({ sock, msg, args, commands, isOwner }) {
    if (!isOwner) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando es solo para el propietario." }, { quoted: msg });
    }

    const commandName = args[0]?.toLowerCase();
    if (!commandName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, especifica el nombre del comando a poner en mantenimiento." }, { quoted: msg });
    }

    if (!commands.has(commandName)) {
        return sock.sendMessage(msg.key.remoteJid, { text: `El comando "${commandName}" no existe.` }, { quoted: msg });
    }

    const maintenanceList = readMaintenanceDb();
    if (maintenanceList.includes(commandName)) {
      return sock.sendMessage(msg.key.remoteJid, { text: `El comando "${commandName}" ya está en mantenimiento.` }, { quoted: msg });
    }

    maintenanceList.push(commandName);
    writeMaintenanceDb(maintenanceList);

    await sock.sendMessage(msg.key.remoteJid, { text: `✅ El comando "${commandName}" ha sido puesto en mantenimiento.` }, { quoted: msg });
  }
};

export default mantenimientoCommand;
