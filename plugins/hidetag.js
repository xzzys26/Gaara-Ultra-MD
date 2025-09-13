// Relación de prefijos → banderas de LATAM
const banderasPorPrefijo = {
  "+52": "🇲🇽", // México
  "+1": "🇺🇸", // USA/Caribe
  "+504": "🇭🇳", // Honduras
  "+57": "🇨🇴", // Colombia
  "+58": "🇻🇪", // Venezuela
  "+51": "🇵🇪", // Perú
  "+1809": "🇩🇴", // Rep. Dominicana
  "+1829": "🇩🇴",
  "+1849": "🇩🇴",
  "+502": "🇬🇹", // Guatemala
  "+503": "🇸🇻", // El Salvador
  "+505": "🇳🇮", // Nicaragua
  "+506": "🇨🇷", // Costa Rica
  "+507": "🇵🇦", // Panamá
  "+591": "🇧🇴", // Bolivia
  "+593": "🇪🇨", // Ecuador
  "+595": "🇵🇾", // Paraguay
  "+598": "🇺🇾", // Uruguay
  "+54": "🇦🇷", // Argentina
  "+55": "🇧🇷", // Brasil
  "+56": "🇨🇱", // Chile
  "+590": "🇸🇽", // Saint Martin
};

// Función para obtener bandera según número
function getBandera(jid) {
  const numero = jid.split("@")[0];
  for (const prefijo of Object.keys(banderasPorPrefijo)) {
    if (numero.startsWith(prefijo.replace("+", ""))) {
      return banderasPorPrefijo[prefijo];
    }
  }
  return "🌍"; // default si no encuentra
}

const invocarCommand = {
  name: "invocar",
  category: "grupos",
  description: "Etiqueta a todos los miembros de un grupo con su bandera de país.",
  aliases: ["hidetag", "tag"],

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "❌ Este comando solo se puede usar en grupos." }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const senderIsAdmin = metadata.participants.find(
        p => p.id === (msg.key.participant || msg.key.remoteJid)
      )?.admin;

      if (!senderIsAdmin) {
        return sock.sendMessage(from, { text: "🚫 No tienes permisos de administrador." }, { quoted: msg });
      }

      const participants = metadata.participants.map(p => p.id);
      const messageText = args.join(' ') || "📢 ¡Atención a todos!";

      // Construir texto con menciones y banderas
      let mentionsText = "╭━━━〔 *GAARA-INVOCACIÓN* 〕━━━⬣\n";
      mentionsText += `┃ 📢 Mensaje: *${messageText}*\n┃\n`;

      for (const jid of participants) {
        const bandera = getBandera(jid);
        const numero = jid.split("@")[0];
        mentionsText += `┃ ╰┈➤ ${bandera} @${numero}\n`;
      }

      mentionsText += "╰━━━━━━━━━━━━━━━━━━━━⬣";

      await sock.sendMessage(from, {
        text: mentionsText,
        mentions: participants
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando invocar:", e);
      await sock.sendMessage(from, { text: "⚠️ Ocurrió un error al intentar invocar a todos." }, { quoted: msg });
    }
  }
};

export default invocarCommand;