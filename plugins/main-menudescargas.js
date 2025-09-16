// creado y editado por BrayanOFC
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const creador = ['5216631288816']

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const senderNumber = m.sender.replace(/[^0-9]/g, '')

    if (!creador.includes(senderNumber)) {
      return conn.sendMessage(
        m.chat,
        { text: '❌ Solo el creador puede usar este comando.' },
        { quoted: m }
      )
    }

    let descargasHelp = Object.values(global.plugins)
      .filter(p => p?.tags?.includes('descargas') && !p.disabled)
      .map(p => {
        let helpText = Array.isArray(p.help) ? p.help[0] : p.help
        return `☁️ ${_p}${helpText}`
      })
      .join('\n')

    let menuText = `
╭━━━『📥 DESCARGAS Z』━━━╮
┃ 🐉 Aquí tienes los comandos
┃ ⚡ para descargar contenido
┃ 🔥 desde diferentes plataformas
╰━━━━━━━━━━━━━━━━━━━━━━╯

${descargasHelp}

👑 © ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ 
`.trim()

    await m.react('📥')

    let imgBuffer = await (await fetch('https://files.catbox.moe/vhrzvc.jpg')).buffer()
    let media = await prepareWAMessageMedia({ image: imgBuffer }, { upload: conn.waUploadToServer })

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          imageMessage: {
            ...media.imageMessage,
            caption: menuText,
            contextInfo: {
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363394965381607@newsletter',
                newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱 • Update',
                serverMessageId: 101
              }
            }
          }
        }
      }
    }, { userJid: m.sender, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Menú de descargas falló.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menudescargas']
handler.tags = ['creador']
handler.command = ['menudescargas', 'menudz']
handler.register = true
handler.estrellas = 9

export default handler