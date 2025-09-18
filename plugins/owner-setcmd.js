let handler = async (m, { conn, text }) => {
  global.db.data.sticker = global.db.data.sticker || {}
  
  if (!m.quoted) return conn.reply(m.chat, `🥷 Responde a un *sticker* para agregar un comando.`, m)
  if (!m.quoted.fileSha256) return conn.reply(m.chat, `⚡️ Ese sticker no tiene un *hash válido*.`, m)
  if (!text) return conn.reply(m.chat, `🚀 Ingresa el nombre del comando.`, m)
  
  try {
    let sticker = global.db.data.sticker
    let hash = m.quoted.fileSha256.toString('base64')
    
    if (sticker[hash] && sticker[hash].locked) 
      return conn.reply(m.chat, `❌️ No tienes permiso para cambiar este comando de Sticker.`, m)
    
    sticker[hash] = {
      text,
      mentionedJid: m.mentionedJid,
      creator: m.sender,
      at: + new Date,
      locked: false,
    }
    
    await conn.reply(m.chat, `⚡️ Comando guardado con éxito.`, m)
    await m.react('✅')
    
  } catch (e) {
    console.error(e) // 🔎 Para ver el error real en consola
    await m.react('✖️')
  }
}

handler.help = ['cmd'].map(v => 'set' + v + ' *<texto>*')
handler.tags = ['owner']
handler.command = ['setcmd', 'addcmd', 'cmdadd', 'cmdset']
handler.owner = true

export default handler