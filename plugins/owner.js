const ownerCommand = {
  name: "owner",
  category: "general",
  description: "Muestra la información del creador del bot, su número, redes y experiencia.",

  async execute({ sock, msg, config }) {  
    const ownerText = `
╭━━〔 👑 *CREADOR DEL BOT* 👑 〕━━⬣
┃
┃ 👤 *Nombre*: ${config.ownerName}
┃ 📱 *Número*: wa.me/+18493907272
┃
┃ 💻 *Experiencia*:
┃   ━ Desarrollo Web y Bots de WhatsApp
┃   ━ Automatización y creación de sistemas
┃   ━ Integración de APIs y gestión de BD
┃   ━ Seguridad y despliegue en servidores
┃
┃ 🛠️ *Habilidades*:
┃   ➪ JavaScript
┃   ➪ Node.js
┃   ➪ Python
┃   ➪ WhatsApp API
┃   ➪ Automatización de tareas
┃   ➪ Sistemas escalables
┃
┃ 🌐 *Redes*:
┃   🔗 GitHub: github.com/imoXzzy
┃   🔗 Instagram: instagram.com/xzzys26
┃
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

    // Reacción 👑
    await sock.sendMessage(msg.key.remoteJid, { 
      react: { text: "👑", key: msg.key } 
    });

    // Envío del mensaje con imagen + texto
    await sock.sendMessage(  
      msg.key.remoteJid,   
      {   
        image: { url: "https://files.catbox.moe/z79xxj.jpg" },  
        caption: ownerText   
      },   
      { quoted: msg }  
    );
  }
};

export default ownerCommand;