import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }) } catch {} }

async function loadImageSmart(src) {
  if (!src) return null
  try {
    if (/^https?:\/\//i.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error('fetch fail')
      const buf = Buffer.from(await res.arrayBuffer())
      return await loadImage(buf)
    }
    return await loadImage(src)
  } catch { return null }
}

async function makeCard({ title = 'Bienvenida', subtitle = '', avatarUrl = '', bgUrl = '' }) {
  const width = 900, height = 380
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#06141f')
  gradient.addColorStop(1, '#0b2a3b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (bgUrl) {
    try {
      const bg = await loadImageSmart(bgUrl)
      if (bg) ctx.drawImage(bg, 0, 0, width, height)
    } catch {}
  }

  if (avatarUrl) {
    try {
      const av = await loadImageSmart(avatarUrl)
      ctx.save()
      ctx.beginPath()
      ctx.arc(width / 2, height / 2 - 20, 80, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      if (av) ctx.drawImage(av, width / 2 - 80, height / 2 - 100, 160, 160)
      ctx.restore()
    } catch {}
  }

  ctx.textAlign = 'center'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 48px Sans'
  ctx.fillText(title, width / 2, 60)

  ctx.font = '28px Sans'
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle]
  lines.forEach((t, i) => ctx.fillText(String(t || ''), width / 2, 220 + i * 34))

  return canvas.toBuffer('image/png')
}

async function sendWelcomeOrBye(conn, { jid, userName = 'Usuario', type = 'welcome', groupName = '', participant, customText }) {
  const tmp = path.join(__dirname, '../temp')
  ensureDir(tmp)

  const title = type === 'welcome' ? '¡Bienvenido!' : '¡Adiós!'
  const subtitle = customText || (type === 'welcome'
    ? [`Hola ${userName}, bienvenido al grupo ${groupName}`]
    : [`${userName} se fue del grupo`])

  let avatarUrl = ''
  try { if (participant) avatarUrl = await conn.profilePictureUrl(participant, 'image') } catch {}
  if (!avatarUrl) avatarUrl = 'https://files.catbox.moe/xr2m6u.jpg'
  const bgUrl = 'https://files.cloudkuimages.guru/images/hDv9seru.jpg'

  const buff = await makeCard({ title, subtitle, avatarUrl, bgUrl })
  const file = path.join(tmp, `${type}-${Date.now()}.png`)
  fs.writeFileSync(file, buff)

  const mentionId = participant ? [participant] : []
  const handle = participant ? `@${String(participant).split('@')[0]}` : userName
  await conn.sendMessage(jid, { image: { url: file }, caption: `${title} ${handle}`, mentions: mentionId })
}

const welcomeCommand = {
  name: "welcome",
  category: "grupos",
  description: "Bienvenida automática con tarjeta personalizada.",

  async execute({ sock, update, config }) {
    if (!update || !update.type) return

    const groupId = update.id
    const participant = update.participant
    const updateType = update.type // 'add' o 'remove'

    if (!config.groupSettings) config.groupSettings = {}
    if (!config.groupSettings[groupId]) config.groupSettings[groupId] = {
      enabled: true,
      welcomeText: "Hola {user}, bienvenido al grupo {group}!"
    }
    const settings = config.groupSettings[groupId]
    if (!settings.enabled) return

    const type = updateType === 'add' ? 'welcome' : updateType === 'remove' ? 'bye' : 'welcome'
    const userName = participant ? participant.split('@')[0] : 'Usuario'
    const groupName = "este grupo"

    await sendWelcomeOrBye(sock, {
      jid: groupId,
      userName,
      type,
      groupName,
      participant,
      customText: settings.welcomeText.replace('{user}', userName).replace('{group}', groupName)
    })
  }
}

export default welcomeCommand