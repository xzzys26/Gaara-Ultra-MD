const covidCommand = {
  name: "covid",
  category: "informacion",
  description: "Muestra estadísticas de COVID-19. (En desarrollo)",

  async execute({ sock, msg, args }) {
    const country = args.join(' ') || "global";
    await sock.sendMessage(msg.key.remoteJid, { text: `El comando para ver estadísticas de COVID-19 para *${country}* está en desarrollo.` }, { quoted: msg });
  }
};

export default covidCommand;
