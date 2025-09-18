// créditos by xzzys26 Para Gaara-Ultra-MD 

async function handler(m, { conn }) {
  try {
    await m.react('👨🏻‍💻')

    const imageUrl = 'https://files.catbox.moe/inqghn.jpg'

    let messageText = `
🤖 *Gaara-Ultra-MD*
👤 *Creador:* xzzys26
📱 *Número:* +18097769423
🌐 *Dashboard:* https://dash.deluxehost.cl
💻 *GitHub:* https://github.com/xzzys26
`

    const buttonMessage = {
      image: { url: imageUrl },
      caption: messageText,
      footer: '*⚡ Servicios Privado Con Alta Calidad*',
      buttons: [
        { buttonId: 'contact', buttonText: { displayText: '📲 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽' }, type: 1 },
        { buttonId: 'dashboard', buttonText: { displayText: '🌐 𝗗𝗮𝘀𝗵' }, type: 1 },
        { buttonId: '.code', buttonText: { displayText: '🤖 𝗛𝗮𝘀𝘁𝗲 𝗦𝘂𝗯-𝗕𝗼𝘁' }, type: 1 },
        { buttonId: '.menu', buttonText: { displayText: '↩️ 𝗩𝗼𝗹𝘃𝗲𝗿 𝗔𝗹 𝗠𝗲𝗻𝘂' }, type: 1 }
      ],
      headerType: 4
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    await conn.sendMessage(m.chat, { 
      text: '🤖 *Gaara-Ultra-MD*\n👤 *Creador:* xzzys26\n📱 *Número:* +18097769423\n🌐 *Dashboard:* https://dash.deluxehost.cl\n💻 *GitHub:* https://github.com/xzzys26\n\n*⚡ Servicios Privado Con Alta Calidad*'
    }, { quoted: m })
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler