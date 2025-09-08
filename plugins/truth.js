const truths = [
  "¿Cuál es la cosa más vergonzosa que has hecho?",
  "¿Alguna vez has mentido en tu currículum?",
  "¿Cuál es tu mayor miedo?",
  "¿Qué es lo más loco que has hecho por amor?",
  "¿Si pudieras ser invisible por un día, qué harías?"
];

const truthCommand = {
  name: "truth",
  category: "diversion",
  description: "Te da una pregunta de 'Verdad'.",
  aliases: ["verdad"],

  async execute({ sock, msg }) {
    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `*Verdad:* ${randomTruth}` }, { quoted: msg });
  }
};

export default truthCommand;
