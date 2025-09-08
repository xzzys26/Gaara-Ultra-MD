const questions = [
  "¿Ser invisible o poder volar?",
  "¿Vivir sin música o sin películas?",
  "¿Saber la fecha de tu muerte o la causa de tu muerte?",
  "¿Tener más tiempo o más dinero?",
  "¿Hablar todos los idiomas o poder hablar con los animales?"
];

const wyrCommand = {
  name: "wouldyourather",
  category: "diversion",
  description: "Te da una pregunta de '¿Qué prefieres?'.",
  aliases: ["wyr", "queprefieres"],

  async execute({ sock, msg }) {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `*¿Qué prefieres?*\n\n${randomQuestion}` }, { quoted: msg });
  }
};

export default wyrCommand;
