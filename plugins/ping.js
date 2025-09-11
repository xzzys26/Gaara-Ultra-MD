const os = require("os");

const pingCommand = {
  name: "ping",
  category: "general",
  description: "Comprueba la velocidad de respuesta del bot.",
  aliases: ["p"],

  async execute({ sock, msg }) {
    const startTime = Date.now();
    const sentMsg = await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Calculando..." }, { quoted: msg });
    const endTime = Date.now();
    const latency = endTime - startTime;

    // Info del sistema
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const cpuModel = os.cpus()[0].model;

    const statusMessage = `
╭━━━〔 *🚀 ESTADO DEL BOT* 〕━━━╮
┃ ⚡ *Velocidad:* ${latency} ms
┃ 💾 *RAM usada:* ${usedMem} MB / ${totalMem} GB
┃ ⏳ *Uptime:* ${hours}h ${minutes}m ${seconds}s
┃ 🖥️ *CPU:* ${cpuModel}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`;

    await sock.sendMessage(
      msg.key.remoteJid,
      { text: statusMessage },
      { quoted: msg }
    );
  }
};

export default pingCommand;