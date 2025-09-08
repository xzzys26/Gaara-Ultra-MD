const facts = [
  "Las nutrias marinas se toman de la mano cuando duermen para no separarse.",
  "El corazón de una ballena azul es tan grande que un humano podría nadar por sus arterias.",
  "Las vacas tienen mejores amigas y se estresan cuando se separan.",
  "Los pulpos tienen tres corazones.",
  "La miel nunca se echa a perder."
];

const factCommand = {
  name: "fact",
  category: "informacion",
  description: "Te da un dato curioso.",
  aliases: ["dato"],

  async execute({ sock, msg }) {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `*Dato Curioso:*\n\n${randomFact}` }, { quoted: msg });
  }
};

export default factCommand;
