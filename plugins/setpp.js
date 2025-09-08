import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const setppCommand = {
  name: "setpp",
  category: "propietario",
  description: "Establece la foto de perfil del bot.",

  async execute({ sock, msg, config }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes responder a una imagen para establecerla como foto de perfil." }, { quoted: msg });
    }

    try {
      const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
      let buffer = Buffer.from([]);
      for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      await sock.updateProfilePicture(botJid, buffer);

      await sock.sendMessage(msg.key.remoteJid, { text: "✅ Foto de perfil actualizada exitosamente." }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando setpp:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al actualizar la foto de perfil." }, { quoted: msg });
    }
  }
};

export default setppCommand;
