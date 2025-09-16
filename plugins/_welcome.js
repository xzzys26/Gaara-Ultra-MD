//codigo creado por BrayanOFC 
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const links = {
  welcome: 'https://qu.ax/SfjSV.png',
  bye: 'https://qu.ax/Rddry.png'
}

export async function welcomeHandler(conn, update) {
  try {
    const { id, participants, action } = update
    for (let user of participants) {
      if (action === 'add') {
        
        let msg = await prepareWAMessageMedia(
          { image: { url: links.welcome } },
          { upload: conn.waUploadToServer }
        )

        const m = generateWAMessageFromContent(
          id,
          {
            viewOnceMessage: {
              message: {
                ...msg,
                caption: `👋 Bienvenido Bro @${user.split('@')[0]}`
              }
            }
          },
          { userJid: conn.user.id }
        )

        await conn.relayMessage(id, m.message, { messageId: m.key.id })

      } else if (action === 'remove') {
        
        let msg = await prepareWAMessageMedia(
          { image: { url: links.bye } },
          { upload: conn.waUploadToServer }
        )

        const m = generateWAMessageFromContent(
          id,
          {
            viewOnceMessage: {
              message: {
                ...msg,
                caption: `👋 Nadie te quiso 💀 @${user.split('@')[0]}`
              }
            }
          },
          { userJid: conn.user.id }
        )

        await conn.relayMessage(id, m.message, { messageId: m.key.id })
      }
    }
  } catch (e) {
    console.log('❌ Error en welcomeHandler:', e)
  }
}