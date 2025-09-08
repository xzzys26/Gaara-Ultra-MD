const responses = [
  "Es cierto.",
  "Sin duda.",
  "Sí, definitivamente.",
  "Puedes contar con ello.",
  "Como yo lo veo, sí.",
  "Lo más probable.",
  "Las perspectivas son buenas.",
  "Sí.",
  "Las señales apuntan a que sí.",
  "Respuesta confusa, intenta de nuevo.",
  "Vuelve a preguntar más tarde.",
  "Mejor no decírtelo ahora.",
  "No se puede predecir ahora.",
  "Concéntrate y vuelve a preguntar.",
  "No cuentes con ello.",
  "Mi respuesta es no.",
  "Mis fuentes dicen que no.",
  "Las perspectivas no son tan buenas.",
  "Muy dudoso."
];

const eightBallCommand = {
  name: "8ball",
  category: "juegos",
  description: "Pregúntale a la bola 8 mágica. Uso: 8ball <pregunta>",

  async execute({ sock, msg, args }) {
    if (args.length === 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Debes hacerme una pregunta para que pueda responder." }, { quoted: msg });
    }

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const message = `🎱 *Bola 8 Mágica* 🎱\n\n*Tu pregunta:* ${args.join(' ')}\n*Mi respuesta:* ${randomResponse}`;

    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};

export default eightBallCommand;
