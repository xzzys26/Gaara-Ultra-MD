import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const infoCreador = async (client, chatId) => {
  // Imagen del menú (puedes cambiar la URL si quieres)
  const imageUrl = 'https://i.ibb.co/YourImageURL.jpg'

  // Preparamos la imagen
  const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: client.waUploadToServer })

  // Texto del info creador con emojis
  let messageText = `
🤖 Bot: Gaara-Ultra-MD
👤 Creador: xzzys26
📱 Número: 18097769423
🌐 Sitio web: https://xzys-ultra.vercel.app
`

  // Botones interactivos
  const buttons = [
    { buttonId: '.menu', buttonText: { displayText: '🏠 Volver al Menú' }, type: 1 },
    { buttonId: '.code', buttonText: { displayText: '💻 Crear Sub-Bot' }, type: 1 }
  ]

  // Construimos el mensaje
  const buttonMessage = {
    imageMessage: media.imageMessage,
    contentText: messageText,
    footerText: '🌪️ Gaara-Ultra-MD',
    buttons: buttons,
    headerType: 4
  }

  // Enviamos el mensaje
  const sentMsg = await client.sendMessage(chatId, buttonMessage)
  return sentMsg
}

export default infoCreador