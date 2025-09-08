const dares = [
  "Envía un mensaje de voz cantando la canción que tienes en la cabeza.",
  "Publica 'soy una patata' en tu estado de WhatsApp.",
  "Envía una selfie haciendo una cara graciosa a este grupo.",
  "Imita a tu emoji favorito.",
  "Cuenta un chiste malo."
];

const dareCommand = {
  name: "dare",
  category: "diversion",
  description: "Te da un 'Reto'.",
  aliases: ["reto"],

  async execute({ sock, msg }) {
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `*Reto:* ${randomDare}` }, { quoted: msg });
  }
};

export default dareCommand;
