const ownerCommand = {
    name: "owner",
    category: "general",
    description: "Muestra la información del creador del bot, su número y experiencia.",

    async execute({ sock, msg, config }) {
        const ownerText = `
╭━━━〔 *👤 Información del Creador* 〕━━━╮

➺ *Nombre:* ${config.ownerName}
➺ *Número:* +1 849 390 7272
➺ *Descripción:* Soy desarrollador especializado en Web y Bots de WhatsApp, con amplia experiencia en automatización, creación de sistemas y herramientas personalizadas. Me dedico a optimizar flujos de trabajo, desarrollar funciones avanzadas para bots, integrar APIs, y crear experiencias interactivas y dinámicas para usuarios. Además, implemento seguridad, gestión de bases de datos y despliegue en servidores de alta disponibilidad.

➺ *Habilidades:* JavaScript, Node.js, Python, WhatsApp API, Automatización de tareas, Diseño de sistemas escalables.
`;

        // Enviar mensaje con imagen
        await sock.sendMessage(
            msg.key.remoteJid, 
            { 
                image: { url: "https://files.catbox.moe/ra9qty.jpg" }, // reemplaza con tu URL
                caption: ownerText 
            }, 
            { quoted: msg }
        );
    }
};

export default ownerCommand;