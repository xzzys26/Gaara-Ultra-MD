const setNameCommand = {
  name: "setname",
  category: "propietario",
  description: "Establece el nombre (estado/info) del bot.",

  async execute({ sock, msg, args, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    const newName = args.join(' ');
    if (!newName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un nuevo nombre para el bot." }, { quoted: msg });
    }

    try {
      await sock.updateProfileName(newName);
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Nombre del bot actualizado a: *${newName}*` }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando setname:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al actualizar el nombre del bot." }, { quoted: msg });
    }
  }
};

export default setNameCommand;
