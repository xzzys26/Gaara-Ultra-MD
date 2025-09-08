const igCommand = {
  name: "ig",
  category: "informacion",
  description: "Busca información de un perfil de Instagram. (En desarrollo)",

  async execute({ sock, msg, args }) {
    const username = args[0];
    if (!username) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un nombre de usuario de Instagram." }, { quoted: msg });
    }
    await sock.sendMessage(msg.key.remoteJid, { text: `El comando para buscar perfiles de Instagram está en desarrollo. No se puede obtener información para *${username}* en este momento.` }, { quoted: msg });
  }
};

export default igCommand;
