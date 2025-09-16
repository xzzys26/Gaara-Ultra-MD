// creado y editado por BrayanOFC
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

           const op = [a + b + c + d]

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const senderNumber = m.sender.replace(/[^0-9]/g, '')
const c = "178"
    if (!op.includes(senderNumber)) {
      return conn.sendMessage(m.chat, { text: '❌ Solo el owner puede usar este comando.' }, { quoted: m })
    }
const a = "52"
    let ownerHelp = Object.values(global.plugins)
      .filter(p => p?.tags?.includes('owner') && !p.disabled)
      .map(p => {
        let helpText = Array.isArray(p.help) ? p.help[0] : p.help
        return `👑 ${_p}${helpText}`
      })
      .join('\n')

    let menuText = `
╭━━━『👑 OWNER 』━━━╮
┃ ⚡ Comandos exclusivos del Owner
┃ 🔥 Usa con cuidado
╰━━━━━━━━━━━━━━━━━━━━━━╯

${ownerHelp}

👑 © ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ
`.trim()
const b = "1664"
    await m.react('👑')

    // 📸 Imagen del menú
    let imgBuffer = await (await fetch('https://files.catbox.moe/hn9clc.jpg')).buffer()
    let media = await prepareWAMessageMedia({ image: imgBuffer }, { upload: conn.waUploadToServer })

    let msg = generateWAMessageFromContent(
      m.chat,
      {
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
      },
      { userJid: m.sender, quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Menú Owner falló.\n\n${e}`, m)
    console.error(e)
  }
}
const d = "4469"
handler.help = ['menuowner']
handler.tags = ['creador']
handler.command = ['menuowner', 'menuadmin']
handler.register = true

export default handler