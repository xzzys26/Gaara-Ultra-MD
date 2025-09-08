import { loadCommands, commands, aliases } from '../index.js';

const reloadCommand = {
  name: "reload",
  category: "propietario",
  description: "Recarga todos los comandos del bot.",

  async execute({ sock, msg, isOwner }) {
    if (!isOwner) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando es solo para el propietario." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: "🔄 Recargando comandos..." }, { quoted: msg });

      await loadCommands();

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Recarga completa. Se cargaron ${commands.size} comandos y ${aliases.size} alias.` }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando reload:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al recargar los comandos." }, { quoted: msg });
    }
  }
};

export default reloadCommand;
