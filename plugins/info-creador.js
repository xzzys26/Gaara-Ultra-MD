// créditos by xzzys26 Para Gaara-Ultra-MD 

async function handler(m, { conn, usedPrefix }) => {
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

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: messageText,
      footer: '*⚡ Servicios Privado Con Alta Calidad*',
      buttons: [
        {
          buttonId: `${usedPrefix}code`,
          buttonText: { displayText: "🤖 𝗦𝘂𝗯-𝗕𝗼𝘁" },
          type: 1
        },
        {
          buttonId: `${usedPrefix}menu`,
          buttonText: { displayText: "↩️ 𝗠𝗲𝗻𝘂" },
          type: 1
        }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    await m.reply('❌ Error al mostrar información del creador')
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler