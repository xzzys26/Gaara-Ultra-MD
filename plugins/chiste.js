const chistes = [
  "¿Qué le dice un pez a otro? ¡Nada!",
  "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
  "¿Cómo se dice pañuelo en japonés? Saka-moko.",
  "¿Qué hace una abeja en el gimnasio? ¡Zumba!",
  "Si los zombies se descomponen con el tiempo, ¿son biodegradables?"
];

const chisteCommand = {
  name: "chiste",
  category: "juegos",
  description: "El bot te cuenta un chiste.",

  async execute({ sock, msg }) {
    const randomChiste = chistes[Math.floor(Math.random() * chistes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: randomChiste }, { quoted: msg });
  }
};

export default chisteCommand;
