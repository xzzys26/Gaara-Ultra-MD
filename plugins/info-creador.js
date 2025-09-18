// créditos by xzzys26 Para Gaara-Ultra-MD 
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

async function handler(m, { conn }) {
  try {
    await m.react('👨🏻‍💻')
    
    // Imagen del creador
    const imageUrl = 'https://files.catbox.moe/g3nbig.jpg'

    // Preparamos la imagen
    const media = await prepareWAMessageMedia(
      { image: { url: imageUrl } }, 
      { upload: conn.waUploadToServer }
    )

    // Texto del info creador
    let messageText = `
🤖 *Gaara-Ultra-MD*
👤 *Creador:* xzzys26
📱 *Número:* +18097769423
🌐 *Dashboard:* https://dash.deluxehost.cl
💻 *GitHub:* https://github.com/xzzys26
`

    // Mensaje con botones
    const templateMessage = {
      image: media,
      caption: messageText,
      footer: '⚡ Servicios Privado Con Alta Calidad',
      templateButtons: [
        {index: 1, urlButton: {displayText: '📞 WhatsApp', url: 'https://wa.me/18097769423'}},
        {index: 2, urlButton: {displayText: '🌐 Dashboard', url: 'https://dash.deluxehost.cl'}},
        {index: 3, quickReplyButton: {displayText: '🏠 Menú Principal', id: '.menu'}}
      ]
    }

    // Enviamos el mensaje
    await conn.sendMessage(m.chat, templateMessage, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    await m.reply('❌ Error al mostrar información del creador')
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler