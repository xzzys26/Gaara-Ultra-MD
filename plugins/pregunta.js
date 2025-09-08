const trivia = [
  { q: "¿Cuál es el planeta más grande del sistema solar?", a: "Júpiter" },
  { q: "¿Quién escribió 'Cien años de soledad'?", a: "Gabriel García Márquez" },
  { q: "¿Cuál es la capital de Japón?", a: "Tokio" },
  { q: "¿En qué año llegó el hombre a la luna?", a: "1969" },
  { q: "¿Cuál es el río más largo del mundo?", a: "El río Amazonas" }
];

const preguntaCommand = {
  name: "pregunta",
  category: "juegos",
  description: "Responde a una pregunta de trivia.",

  async execute({ sock, msg }) {
    const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];
    const question = `*Pregunta de Trivia:*\n\n${randomTrivia.q}\n\n(La respuesta es: ||${randomTrivia.a}||)`;

    await sock.sendMessage(msg.key.remoteJid, { text: question }, { quoted: msg });
  }
};

export default preguntaCommand;
