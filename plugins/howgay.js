const howgayCommand = {
  name: "howgay",
  category: "diversion",
  description: "Mide el nivel de homosexualidad de alguien.",

  async execute({ sock, msg, args }) {
    let target = "Tú";
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (mentionedJid) {
        target = `@${mentionedJid.split('@')[0]}`;
    } else if (args.length > 0) {
        target = args.join(' ');
    }

    const percentage = Math.floor(Math.random() * 101);
    const message = `*🏳️‍🌈 Medidor de Homosexualidad 🏳️‍🌈*\n\n` +
                  `*${target}* es... *${percentage}%* gay.`;

    await sock.sendMessage(msg.key.remoteJid, { text: message, mentions: mentionedJid ? [mentionedJid] : [] }, { quoted: msg });
  }
};

export default howgayCommand;
