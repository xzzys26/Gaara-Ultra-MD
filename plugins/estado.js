import os from 'os';

// Función para formatear el tiempo de actividad
function formatUptime(seconds) {
  function pad(s) {
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

// Función para formatear bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const estadoCommand = {
  name: "estado",
  category: "general",
  description: "Muestra el estado y rendimiento del bot.",
  aliases: ["status"],

  async execute({ sock, msg }) {
    // Ping
    const startTime = Date.now();
    await sock.sendPresenceUpdate('composing', msg.key.remoteJid);
    const endTime = Date.now();
    const ping = endTime - startTime;

    // Uptime
    const uptime = process.uptime();

    // Memory
    const memoryUsage = process.memoryUsage();

    const estadoMessage = `*📊 Estado del Bot 📊*\n\n` +
                          `*🚀 Velocidad:*\n` +
                          `  - Ping: ${ping} ms\n\n` +
                          `*⏱️ Tiempo de Actividad:*\n` +
                          `  - ${formatUptime(uptime)}\n\n` +
                          `*💾 Memoria Usada:*\n` +
                          `  - Total: ${formatBytes(memoryUsage.heapTotal)}\n` +
                          `  - En Uso: ${formatBytes(memoryUsage.heapUsed)}`;

    await sock.sendMessage(msg.key.remoteJid, { text: estadoMessage }, { quoted: msg });
  }
};

export default estadoCommand;
