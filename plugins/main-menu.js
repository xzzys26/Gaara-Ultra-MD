//creado y editado por BrayanOFC
import { xpRange } from '../lib/levelling.js'
import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const botname = global.botname || '🌪️ 𝙂𝘼𝘼𝙍𝘼-𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🌪️'
let tags = {
  'serbot': '🤖 SUB BOTS',
  'info': '📊 INFO',
  'main': '📜 MENÚS'
}
const creador = 'Xzzys26'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId]
    let name = await conn.getName(userId)
    let mode = global.opts?.self ? "🔒 Privado" : "🌐 Público"
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length
    let uptime = clockString(process.uptime() * 1000)

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

    let rango = conn?.user?.jid === userId ? '👑 Gaara-Ultra-MD 🅥' : '⚡ SUB-BOT ULTRA'
    let { pais, hora, saludo } = getPaisHora(userId)

    let menuText = `
╭━━━〔 ⚡ *GAARA-ULTRA-MD* ⚡ 〕━━━⬣
┃ ➪ 🤖 Nombre: *${botname}*
┃ ➪ 👤 Creador: *${creador}*
┃ ➪ 🔐 Estado: *${mode}*
┃ ➪ 🗄️ Usuarios: *${totalreg}*
┃ ➪ ⏱️ Uptime: *${uptime}*
┃ ➪ 💻 Hosting: *Termux/VPS*
┃ ➪ 🌎 País: *${pais}*
┃ ➪ 🕒 Hora: *${hora}*
┃ ➪ 💬 Saludo: *${saludo}*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 📜 *MENÚS DISPONIBLES* 〕━━━⬣
${Object.keys(tags).map(tag => {
  const commandsForTag = help.filter(menu => menu.tags.includes(tag))
  if (commandsForTag.length === 0) return ''
  let section = `
┃ ➪ ${tags[tag]} ${getRandomEmoji()}
${commandsForTag.map(menu => menu.help.map(help =>
  `┃╰┈➤ ⚡︎ ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}`
  return section
}).filter(text => text !== '').join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🥷🏽⚡️ © Powered by xzzys26 
`.trim()

    await m.react('⚡')

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

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getRandomEmoji() {
  const emojis = ['🐉', '🎆', '⚡', '🔥', '🌌', '💥']
  return emojis[Math.floor(Math.random() * emojis.length)]
}

// ⏱️ Funciones extra
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}


// 🌍 Hora y saludo según país
function getPaisHora(jid) {
  let codigo = jid.startsWith('+') ? jid.split('@')[0].slice(0, 3) : ''
  let zonas = {
    '+51': { pais: '🇵🇪 Perú', zona: 'America/Lima' },
    '+52': { pais: '🇲🇽 México', zona: 'America/Mexico_City' },
    '+58': { pais: '🇻🇪 Venezuela', zona: 'America/Caracas' },
    '+57': { pais: '🇨🇴 Colombia', zona: 'America/Bogota' },
    '+54': { pais: '🇦🇷 Argentina', zona: 'America/Argentina/Buenos_Aires' },
    '+56': { pais: '🇨🇱 Chile', zona: 'America/Santiago' },
    '+55': { pais: '🇧🇷 Brasil', zona: 'America/Sao_Paulo' },
    '+53': { pais: '🇨🇺 Cuba', zona: 'America/Havana' },
    '+507': { pais: '🇵🇦 Panamá', zona: 'America/Panama' }
  }

  let datos = zonas[codigo] || { pais: '🌎 Desconocido', zona: 'America/Lima' }
  let fecha = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: datos.zona })
  let saludo = getSaludo(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', hour12: false, timeZone: datos.zona }))
  return { pais: datos.pais, hora: fecha, saludo }
}

function getSaludo(horaStr) {
  let hora = parseInt(horaStr.split(':')[0])
  if (hora >= 5 && hora < 12) return "🌅 Buenos días"
  if (hora >= 12 && hora < 18) return "☀️ Buenas tardes"
  return "🌙 Buenas noches"
}