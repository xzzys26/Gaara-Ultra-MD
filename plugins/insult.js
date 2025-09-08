const insultCommand = {
  name: "insultar",
  category: "juegos",
  description: "Insulta (de broma) a un usuario.",

  async execute({ sock, msg, args }) {
    let targetName = args.join(' ');
    let mentions = [];

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (mentionedJid) {
        targetName = `@${mentionedJid.split('@')[0]}`;
        mentions.push(mentionedJid);
    }

    if (!targetName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Menciona a alguien a quien insultar." }, { quoted: msg });
    }

    const insults = [
      `*${targetName}*, pareces un Teletubbie con resaca.`,
      `Si la belleza fuera un delito, *${targetName}* sería inocente.`,
      `*${targetName}*, ¿te caíste de cara cuando eras pequeño?`,
      `El cerebro de *${targetName}* es como el Triángulo de las Bermudas, la información entra y nunca más se sabe de ella.`
    ];

    const randomMessage = insults[Math.floor(Math.random() * insults.length)];

    await sock.sendMessage(msg.key.remoteJid, { text: randomMessage, mentions: mentions }, { quoted: msg });
  }
};

export default insultCommand;
