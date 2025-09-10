const ownerCommand = {
  const ownerCommand = {
    name: "owner",
    category: "general",
    description: "Muestra la información del creador del bot, su número, redes y experiencia.",

    async execute({ sock, msg, config }) {
        const ownerText = `
👤 Nombre: ${config.ownerName}
📱 Número: wa.me/+18493907272
  
Soy desarrollador especializado en Web y Bots de WhatsApp, con experiencia en automatización, creación de sistemas y herramientas personalizadas. Trabajo en optimización de flujos de trabajo, funciones avanzadas para bots, integración de APIs, seguridad, gestión de bases de datos y despliegue en servidores.

💻 Habilidades:  
- JavaScript  
- Node.js  
- Python  
- WhatsApp API  
- Automatización de tareas  
- Diseño de sistemas escalables  

🌐 Redes:  
- GitHub: https://github.com/imoXzzy  
- Instagram: https://instagram.com/xzzys26
`;

        // Enviar mensaje con imagen
        await sock.sendMessage(
            msg.key.remoteJid, 
            { 
                image: { url: "https://files.catbox.moe/fhvm13.jpg" },
                caption: ownerText 
            }, 
            { quoted: msg }
        );

        // Reaccionar al mensaje
        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: "👨🏻‍💻", key: msg.key }
        });
    }
};

export default ownerCommand;