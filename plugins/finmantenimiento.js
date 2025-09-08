import { readMaintenanceDb, writeMaintenanceDb } from '../lib/database.js';

const finMantenimientoCommand = {
  name: "finmantenimiento",
  category: "propietario",
  description: "Quita un comando del modo de mantenimiento.",
  aliases: ["endmaintenance"],

  async execute({ sock, msg, args, isOwner }) {
    if (!isOwner) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando es solo para el propietario." }, { quoted: msg });
    }

    const commandName = args[0]?.toLowerCase();
    if (!commandName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, especifica el nombre del comando a quitar del mantenimiento." }, { quoted: msg });
    }

    let maintenanceList = readMaintenanceDb();
    if (!maintenanceList.includes(commandName)) {
      return sock.sendMessage(msg.key.remoteJid, { text: `El comando "${commandName}" no estaba en mantenimiento.` }, { quoted: msg });
    }

    maintenanceList = maintenanceList.filter(cmd => cmd !== commandName);
    writeMaintenanceDb(maintenanceList);

    await sock.sendMessage(msg.key.remoteJid, { text: `✅ El comando "${commandName}" ha sido quitado del mantenimiento.` }, { quoted: msg });
  }
};

export default finMantenimientoCommand;
