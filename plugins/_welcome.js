//codigo creado por BrayanOFC 
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

export async function welcomeHandler(conn, update) {
  try {
    const { id, participants, action } = update
    for (let user of participants) {
      if (action === 'add') {
        let welImg = 'https://qu.ax/SfjSV.png'
        let msg = await prepareWAMessageMedia({ image: { url: welImg } }, { upload: conn.waUploadToServer })

        const m = generateWAMessageFromContent(id, {
          viewOnceMessage: {
            message: {
              ...msg,
              caption: ` Bienvenido Bro @${user.split('@')[0]}`
            }
          }
        }, { userJid: conn.user.id })

        await conn.relayMessage(id, m.message, { messageId: m.key.id })

      } else if (action === 'remove') {
         let byeImg = 'https://qu.ax/Rddry.png'
        let msg = await prepareWAMessageMedia({ image: { url: byeImg } }, { upload: conn.waUploadToServer })

        const m = generateWAMessageFromContent(id, {
          viewOnceMessage: {
            message: {
              ...msg,
              caption: `Nadie te quiso 💀 @${user.split('@')[0]}  
`
            }
          }
        }, { userJid: conn.user.id })

        await conn.relayMessage(id, m.message, { messageId: m.key.id })
      }
    }
  } catch (e) {
    console.log(e)
  }
}