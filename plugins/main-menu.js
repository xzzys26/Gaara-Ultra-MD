//créditos y creador de codigo BrayanOFC 
import { xpRange } from '../lib/levelling.js'
import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const botname = global.botname || '🌪️ 𝙂𝘼𝘼𝙍𝘼-𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🌪️'
let tags = {
  'serbot': '🤖 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦',
  'info': '🌀 𝗜𝗡𝗙𝗢𝗦',
  'main': '⚡ 𝗠𝗘𝗡𝗨'
}
const creador = 'xzzys26'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId]

    if (!user) {
      global.db.data.users[userId] = { exp: 0, level: 1 }
      user = global.db.data.users[userId]
    }

    let { exp, level } = user
    let { min, xp, max } = xpRange(level, global.multiplier || 1)
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let mode = global.opts?.self ? "🔒 Privado" : "🌐 Público"
    let saludo = getSaludo() // solo dia, tarde, noche

    let menuText = `
╭━━━〔 ⚡ *GAARA-ULTRA-MD* ⚡ 〕━━━⬣
┃ ➪ 🤖 Nombre: *${botname}*
┃ ➪ 👤 Creador: *${creador}*
┃ ➪ 🔐 Estado: *Privdo*
┃ ➪ 💬 Saludo: *${saludo}*
┃ ➪ 💻 Hosting: *Deluxe Host VIP*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 📜 *MENÚS DISPONIBLES* 〕━━━⬣
${Object.keys(tags).map(tag => {
  const commandsForTag = help.filter(menu => menu.tags.includes(tag))
  if (commandsForTag.length === 0) return ''
  let section = `
┃ ➪ ${tags[tag]}
${commandsForTag.map(menu => menu.help.map(help =>
  `┃> ╰┈➤ ⚡︎ ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}`
  return section
}).filter(text => text !== '').join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

👑 Powered by xzzys26 🥷🏽
`.trim()

    await m.react('🥷', '⚡')

    let imgBuffer = await (await fetch('https://files.catbox.moe/3peljt.jpg')).buffer()
    let media = await prepareWAMessageMedia(
      { image: imgBuffer },
      { upload: conn.waUploadToServer }
    )

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
                newsletterName: '🌪️ GAARA-ULTRA-MD • Update',
                serverMessageId: 100
              }
            }
          }
        }
      }
    }, { userJid: m.sender, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Error al mostrar el menú Gaara-Ultra.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']
handler.register = true

export default handler

// ⏱️ Funciones extra
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

// 🌙 Saludo según hora del día
function getSaludo() {
  let hora = new Date().getHours()
  if (hora >= 5 && hora < 12) return "🌅 Buenos días"
  if (hora >= 12 && hora < 18) return "☀️ Buenas tardes"
  return "🌙 Buenas noches"
}