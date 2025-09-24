let handler = async (m, { conn, participants, usedPrefix, command }) => {
  // Verifica si se mencionó o respondió a alguien
  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `📌 *¡Oye, baka!*  
¿Y a quién se supone que debo sacar, eh? 🙄  
Menciona a alguien o respóndeme un mensaje, ¡no me hagas perder el tiempo! 💢`, m);
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0] + '@s.whatsapp.net';

  // Protecciones especiales al estilo Itsuki Nakano ✨
  if (user === conn.user.jid) {
    return conn.reply(m.chat, `🙃 ¿Quieres que me expulse yo sola? Qué tonto eres… ¡ni lo sueñes! 😏`, m);
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `👑 ¡¿Estás loco?! Ese es el dueño del grupo…  
Ni siquiera yo me atrevería a tanto. 😤`, m);
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `🛡️ ¡Oye, baka! Ese es mi creador, no lo voy a sacar aunque lo pidas de rodillas. 😡`, m);
  }

  // Verificar que el usuario está en el grupo
  const groupMembers = participants.map(p => p.id);
  if (!groupMembers.includes(user)) {
    return conn.reply(m.chat, `❌ *¡Tonto!* Esa persona ni siquiera está en el grupo. 🙄`, m);
  }

  // Ejecuta la expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    conn.reply(m.chat, `💥 ¡Fuera!  
Itsuki Nakano lo ha decidido, y cuando yo decido algo, lo cumplo. 💖`, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ *¡Tch!* No pude sacarlo… seguramente no tengo permisos suficientes. 😔`, m);
  }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;

export default handler;