let handler = async (m, { conn }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let user = global.db.data.users[who]

    await m.reply(
        `${who == m.sender 
            ? `Tienes *${user.coin} ${moneda} 💸* en tu Cartera` 
            : `El usuario @${who.split('@')[0]} tiene *${user.coin} ${moneda} 💸* en su Cartera`}.
        `, 
        null, 
        { mentions: [who] }
    )
}

handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['wallet', 'cartera']
handler.group = true

export default handler