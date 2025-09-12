import { sendWelcomeOrBye } from '../lib/welcome.js' // Ajusta la ruta relativa según tu proyecto

const welcomeCommand = {
  name: "welcome",
  category: "grupos",
  description: "Envía una tarjeta de bienvenida o despedida a un usuario que entra o sale del grupo.",
  async execute({ sock, msg, args, commands, config }) {
    try {
      // Determina si es entrada o salida
      const type = args[0] === 'bye' ? 'bye' : 'welcome';
      const participant = msg.sender;
      const groupName = msg.isGroup ? msg.pushName || 'Grupo' : '';

      await sendWelcomeOrBye(sock, {
        jid: msg.key.remoteJid,
        userName: msg.pushName || 'Usuario',
        type,
        groupName,
        participant
      });
    } catch (error) {
      console.error('Error enviando welcome:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Ocurrió un error al enviar la bienvenida.'
      }, { quoted: msg });
    }
  }
};

export default welcomeCommand;