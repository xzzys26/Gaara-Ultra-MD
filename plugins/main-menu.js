//créditos y creador de codigo BrayanOFC 
import { xpRange } from '../lib/levelling.js'
import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const botname = global.botname || '🌪️ 𝙂𝘼𝘼𝙍𝘼-𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🌪️'
const creador = 'xzzys26'

// Categorías
let tags = {
  'serbot': '🤖 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦',
  'info': '🌀 𝗜𝗡𝗙𝗢𝗦',
  'main': '📜 𝗠𝗘𝗡𝗨',
  'nable': '⚡ 𝗠𝗢𝗗𝗢 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗢',
  'cmd': '📝 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  'advanced': '🌟 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗔𝗦',
  'game': '🎮 𝗝𝗨𝗘𝗚𝗢𝗦',
  'rpg': '⚔️ 𝗥𝗣𝗚',
  'group': '📚 𝗚𝗥𝗨𝗣𝗢𝗦',
  'downloader': '📥 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦',
  'sticker': '🖼️ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥',
  'audio': '🔊 𝗔𝗨𝗗𝗜𝗢',
  'search': '🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔',
  'tools': '🧰 𝗛𝗘𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '🎉 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡',
  'anime': '🧧 𝗔𝗡𝗜𝗠𝗘',
  'nsfw': '🔞 𝗡𝗦𝗙𝗪',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠',
  'weather': '🛰️ 𝗖𝗟𝗜𝗠𝗔',
  'news': '📄 𝗡𝗢𝗧𝗜𝗖𝗜𝗔𝗦',
  'finance': '🏛️ 𝗙𝗜𝗡𝗔𝗡𝗭𝗔',
  'education': '🔰 𝗘𝗗𝗨𝗖𝗔𝗖𝗜𝗢𝗡',
  'health': '❤️ 𝗦𝗔𝗟𝗨𝗗',
  'entertainment': '📲 𝗘𝗡𝗧𝗥𝗘𝗧𝗘𝗡𝗜𝗠𝗜𝗘𝗡𝗧𝗢',
  'sports': '⚽ 𝗗𝗘𝗣𝗢𝗥𝗧𝗘𝗦',
  'travel': '✈️ 𝗩𝗜𝗔𝗝𝗘𝗦',
  'food': '🥡 𝗖𝗢𝗠𝗜𝗗𝗔',
  'shopping': '🛍️ 𝗖𝗢𝗠𝗣𝗥𝗔',
  'productivity': '🔖 𝗣𝗥𝗢𝗗𝗨𝗖𝗧𝗜𝗩𝗜𝗗𝗔𝗗',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦 𝗦𝗢𝗖𝗜𝗔𝗟𝗘𝗦',
  'security': '🔱 𝗦𝗘𝗚𝗨𝗥𝗜𝗗𝗔𝗗',
  'custom': '⚙️ 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟𝗜𝗭𝗔𝗗𝗢'
}

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

    // Plugins activos
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let saludo = getSaludo()

    // Construcción del menú limpio
    let menuText = `
╭━━━〔 ⚡ *GAARA-ULTRA-MD* ⚡ 〕━━━⬣
┃ ➪ 🤖 Nombre: *${botname}*
┃ ➪ 👤 Creador: *${creador}*
┃ ➪ 🔐 Estado: *Privado*
┃ ➪ 💬 Saludo: *${saludo}*
┃ ➪ 💻 Hosting: *Deluxe Host VIP*
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`

    // Recorremos categorías sin dejar huecos
    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue // ← se salta vacías

      menuText += `
╭━━━〔 ${tags[tag]} 〕━━━⬣
${comandos.map(menu => menu.help.map(help =>
  `┃ ⚡︎ ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`
    }

    menuText += `
> 👑 Powered by ${creador} 🥷🏽
`

    await m.react('🥷')
    await m.react('⚡')

    let imgBuffer = await (await fetch('https://files.catbox.moe/3np2gx.jpg')).buffer()
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
                newsletterJid: '120363422694102494@newsletter',
                newsletterName: '𝑮𝑨𝑨𝑹𝑨 𝑼𝑳𝑻𝑹𝑨-𝑴𝑫 𝑭𝑰𝑿 ⚡',
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

// Extra
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

// Saludo dinámico
function getSaludo() {
  let hora = new Date().getHours()
  if (hora >= 5 && hora < 12) return "🌅 Buenos días"
  if (hora >= 12 && hora < 18) return "☀️ Buenas tardes"
  return "🌙 Buenas noches"
}