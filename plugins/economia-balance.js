let handler = async (m, { conn }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let user = global.db.data.users[who]
    let total = (user.coin || 0) + (user.bank || 0)

    const texto = `🌟 Informacion de economia 🌟

ᰔᩚ Usuario ➩ *${conn.getName(who)}*   
⛀ Dinero ➩ *${user.coin} ${moneda}*
⚿ Banco ➩ *${user.bank} ${moneda}*
⛁ Total ➩ *${total} ${moneda}*

> *Puedes depositar tu dinero con el comando #deposit*`

    await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.group = true 

export default handler