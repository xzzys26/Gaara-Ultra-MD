// creado Por Xzzys26 adaptado para Gaara-Ultra-MD

let handler = async (m, { conn, participants, usedPrefix, command }) => {
  // Verifica si se mencionó o respondió a alguien
  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `📌 *¿A quién quieres que elimine?*  
No has mencionado ni respondido a nadie...  
No juegues conmigo. ☠️`, m);
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0] + '@s.whatsapp.net';

  // Protecciones especiales estilo Gaara ⚡
  if (user === conn.user.jid) {
    return conn.reply(m.chat, `🙃 ¿Quieres que me saque yo mismo?  
No seas ridículo.`, m);
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `👑 Ese es el dueño del grupo.  
Ni lo sueñes...`, m);
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `🛡️ Ese es mi creador, no lo voy a tocar.`, m);
  }

  // Verificar que el usuario está en el grupo
  const groupMembers = participants.map(p => p.id);
  if (!groupMembers.includes(user)) {
    return conn.reply(m.chat, `❌ Esa persona ni siquiera está en el grupo.`, m);
  }

  // Ejecuta la expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    conn.reply(m.chat, `💥 *Eliminado.*  
Gaara ha decidido que ya no pertenezcas aquí.`, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ No pude sacarlo…  
Seguramente no tengo permisos suficientes.`, m);
  }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;

export default handler;