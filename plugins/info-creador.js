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

    // Enviar mensaje con botones usando el formato correcto
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: messageText,
      footer: '*⚡ Servicios Privado Con Alta Calidad*',
      buttons: [
        { buttonId: 'id1', buttonText: { displayText: '📲 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽' }, type: 1 },
        { buttonId: 'id2', buttonText: { displayText: '🌐 𝗗𝗮𝘀𝗵' }, type: 1 },
        { buttonId: 'id3', buttonText: { displayText: '🤖 𝗦𝘂𝗯-𝗕𝗼𝘁' }, type: 1 },
        { buttonId: 'id4', buttonText: { displayText: '↩️ 𝗠𝗲𝗻𝘂' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })

    // Manejar los botones con un collector
    const filter = (msg) => msg.key.fromMe && msg.key.remoteJid === m.chat
    const collector = conn.ev.createMessageCollector(m.chat, filter, { time: 60000 })
    
    collector.on('collect', async (msg) => {
      const buttonId = msg.message?.buttonsResponseMessage?.selectedButtonId
      
      if (buttonId === 'id1') {
        await conn.sendMessage(m.chat, { text: 'https://wa.me/18097769423' }, { quoted: msg })
      } else if (buttonId === 'id2') {
        await conn.sendMessage(m.chat, { text: 'https://dash.deluxehost.cl' }, { quoted: msg })
      } else if (buttonId === 'id3') {
        await conn.sendMessage(m.chat, { text: '.code' }, { quoted: msg })
      } else if (buttonId === 'id4') {
        await conn.sendMessage(m.chat, { text: '.menu' }, { quoted: msg })
      }
    })

  } catch (error) {
    console.error('Error:', error)
    // Fallback sin botones
    await conn.sendMessage(m.chat, { 
      text: '🤖 *Gaara-Ultra-MD*\n👤 *Creador:* xzzys26\n📱 *Número:* +18097769423\n🌐 *Dashboard:* https://dash.deluxehost.cl\n💻 *GitHub:* https://github.com/xzzys26\n\n*⚡ Servicios Privado Con Alta Calidad*'
    }, { quoted: m })
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler