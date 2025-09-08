const slapCommand = {
  name: "slap",
  category: "juegos",
  description: "Abofetea a un usuario.",

  async execute({ sock, msg, args }) {
    const senderName = msg.pushName || "Alguien";
    let targetName = args.join(' ');
    let mentions = [];

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (mentionedJid) {
        targetName = `@${mentionedJid.split('@')[0]}`;
        mentions.push(mentionedJid);
    }

    if (!targetName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Menciona a alguien a quien abofetear." }, { quoted: msg });
    }

    const slapMessages = [
      `*${senderName}* le dio una bofetada a *${targetName}* con un pescado 🐟.`,
      `*${targetName}* fue abofeteado por *${senderName}* con un guante blanco 🧤.`,
      `*${senderName}* corrió y abofeteó a *${targetName}* con todas sus fuerzas. ¡Ouch!`,
      `Una mano gigante 🖐️ apareció de la nada y abofeteó a *${targetName}* por orden de *${senderName}*.`
    ];

    const randomMessage = slapMessages[Math.floor(Math.random() * slapMessages.length)];

    await sock.sendMessage(msg.key.remoteJid, { text: randomMessage, mentions: mentions }, { quoted: msg });
  }
};

export default slapCommand;
