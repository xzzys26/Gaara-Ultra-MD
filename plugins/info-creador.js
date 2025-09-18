// créditos by xzzys26 Para Gaara-Ultra-MD 

async function handler(m, { conn }) {
  try {
    await m.react('👨🏻‍💻')

    // Imagen del creador
    const imageUrl = 'https://files.catbox.moe/inqghn.jpg'

    // Texto del info creador
    let messageText = `
🤖 *Gaara-Ultra-MD*
👤 *Creador:* xzzys26
📱 *Número:* +18097769423
🌐 *Dashboard:* https://dash.deluxehost.cl
💻 *GitHub:* https://github.com/xzzys26
`

    // Mensaje con botones usando el formato correcto
    const buttonMessage = {
      image: { url: imageUrl },
      caption: messageText,
      footer: '⚡ Servicios Privado Con Alta Calidad',
      buttons: [
        { buttonId: '!contact', buttonText: { displayText: '📞 WhatsApp' }, type: 1 },
        { buttonId: '!dashboard', buttonText: { displayText: '🌐 Dashboard' }, type: 1 },
        { buttonId: '!menu', buttonText: { displayText: '🏠 Menú Principal' }, type: 1 }
      ],
      headerType: 4
    }

    // Enviamos el mensaje
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    await conn.sendMessage(m.chat, { 
      text: '🤖 *Gaara-Ultra-MD*\n👤 *Creador:* xzzys26\n📱 *Número:* +18097769423\n🌐 *Dashboard:* https://dash.deluxehost.cl\n💻 *GitHub:* https://github.com/xzzys26\n\n⚡ Servicios Privado Con Alta Calidad'
    }, { quoted: m })
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler