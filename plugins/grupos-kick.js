let handler = async (m, { conn, usedPrefix, command }) => {

  if (!m.mentionedJid[0] && !m.quoted) 
    return m.reply(`⚡️ Ingresa el tag de un usuario. Ejemplo:\n\n*${usedPrefix + command}* @tag`) 

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

  if (user === conn.user.jid) 
    return m.reply(`❌️ No puedo hacer un auto kick`)

  let creadorJids = global.creador.map(([id]) => id + '@s.whatsapp.net')
  if (creadorJids.includes(user)) 
    return m.reply(`🔱 No puedes expulsar al creador del bot`)

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
  m.reply(`✅️ Usuario eliminado con éxito`) 

}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'expulsar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler