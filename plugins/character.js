const characters = [
  "un valiente caballero ⚔️",
  "un sabio mago 🧙",
  "un astuto pícaro 🏹",
  "un noble rey 👑",
  "un poderoso dragón 🐲",
  "un elfo del bosque 🧝",
  "un enano de la montaña ⚒️"
];

const characterCommand = {
  name: "character",
  category: "diversion",
  description: "Descubre qué personaje de fantasía eres.",
  aliases: ["personaje"],

  async execute({ sock, msg }) {
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    const message = `Eres... ¡*${randomCharacter}*!`;

    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};

export default characterCommand;
