const linkCommand = {
  name: "link",
  category: "grupos",
  description: "Obtiene el enlace de invitación del grupo.",

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid;

    // 1. Verificar si es un grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: "Este comando solo se puede usar en grupos." }, { quoted: msg });
      return;
    }

    try {
      // 2. Obtener metadatos y verificar si el bot es admin
      const metadata = await sock.groupMetadata(from);
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botIsAdmin = metadata.participants.find(p => p.id === botJid)?.admin;

      if (!botIsAdmin) {
        await sock.sendMessage(from, { text: "Necesito ser administrador del grupo para obtener el enlace de invitación." }, { quoted: msg });
        return;
      }

      // 3. Obtener y enviar el enlace
      const inviteCode = await sock.groupInviteCode(from);
      const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

      await sock.sendMessage(from, { text: `Aquí tienes el enlace de invitación del grupo:\n\n${inviteLink}` }, { quoted: msg });

    } catch (error) {
      console.error("Error en el comando link:", error);
      await sock.sendMessage(from, { text: "Ocurrió un error al obtener el enlace del grupo." }, { quoted: msg });
    }
  }
};

export default linkCommand;
