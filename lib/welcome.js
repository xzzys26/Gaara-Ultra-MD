/* Welcome card generator utilities */
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

export async function makeCard({ title = 'Bienvenida', subtitle = '', avatarUrl = '', bgUrl = '', badgeUrl = '' }) {
  const width = 900, height = 380
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const radius = 30
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#06141f')
  gradient.addColorStop(1, '#0b2a3b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.lineWidth = 12
  ctx.strokeStyle = '#19c3ff'
  ctx.strokeRect(6, 6, width - 12, height - 12)

  if (bgUrl) {
    try {
      const bg = await loadImageSmart(bgUrl)
      const pad = 18
      ctx.globalAlpha = 0.9
      if (bg) ctx.drawImage(bg, pad, pad, width - pad * 2, height - pad * 2)
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.fillRect(pad, pad, width - pad * 2, height - pad * 2)
    } catch {}
  }

  let avatarUsedInCenter = false
  let centerR = 54
  let centerCX = Math.round(width / 2)
  let centerCY = 86
  try {
    const useCenterAvatar = !badgeUrl && !!avatarUrl
    centerR = useCenterAvatar ? 80 : 54
    centerCY = useCenterAvatar ? Math.round(height / 2) : 86
    const centerSrc = (badgeUrl && badgeUrl.trim()) ? badgeUrl : (avatarUrl || '')
    if (centerSrc) {
      const badge = await loadImageSmart(centerSrc)
      ctx.save()
      ctx.beginPath(); ctx.arc(centerCX, centerCY, centerR, 0, Math.PI * 2); ctx.closePath(); ctx.clip()
      if (badge) ctx.drawImage(badge, centerCX - centerR, centerCY - centerR, centerR * 2, centerR * 2)
      ctx.restore()
      ctx.lineWidth = 6
      ctx.strokeStyle = '#19c3ff'
      ctx.beginPath(); ctx.arc(centerCX, centerCY, centerR + 4, 0, Math.PI * 2); ctx.stroke()
      avatarUsedInCenter = useCenterAvatar
    }
  } catch {}

  // Title and subtitle
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#000000'
  ctx.shadowBlur = 8
  ctx.font = 'bold 48px Sans'
  const titleY = avatarUsedInCenter ? 70 : 178
  ctx.fillText(title, width / 2, titleY)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#d8e1e8'
  ctx.font = '28px Sans'
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle]
  const subBaseY = avatarUsedInCenter ? (centerCY + centerR + 28) : 218
  lines.forEach((t, i) => ctx.fillText(String(t || ''), width / 2, subBaseY + i * 34))

  if (avatarUrl && !avatarUsedInCenter) {
    try {
      const av = await loadImageSmart(avatarUrl)
      const r = 64
      const x = width - 120, y = height - 120
      ctx.save()
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip()
      if (av) ctx.drawImage(av, x - r, y - r, r * 2, r * 2)
      ctx.restore()
      ctx.lineWidth = 5
      ctx.strokeStyle = '#19c3ff'
      ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke()
    } catch {}
  }

  return canvas.toBuffer('image/png')
}

export async function sendWelcomeOrBye(conn, { jid, userName = 'Usuario', type = 'welcome', groupName = '', participant }) {
  const tmp = path.join(__dirname, '../temp')
  ensureDir(tmp)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const WELCOME_TITLES = ['Bienvenido Bro', 'Bienvenida xD']
  const WELCOME_SUBS = ['Un loco más al grupo', 'Un loco más al grupo!', 'Un locon más al grupo!!']
  const BYE_TITLES = ['Se fue Un Un Gey Del Grupo']
  const BYE_SUBS = ['No vuelvas más, nadie te quiso', 'No vuelvas más', 'Nadie te quiso']

  const title = type === 'welcome' ? pick(WELCOME_TITLES) : pick(BYE_TITLES)
  const subtitle = type === 'welcome' ? [pick(WELCOME_SUBS)] : [pick(BYE_SUBS)]
  const badgeUrl = ''
  const bgUrl = 'https://files.cloudkuimages.guru/images/uzjHbBZe.jpg'
  let avatarUrl = ''
  try {
    if (participant) avatarUrl = await conn.profilePictureUrl(participant, 'image')
  } catch {}
  if (!avatarUrl) avatarUrl = 'https://files.catbox.moe/xr2m6u.jpg'

  const buff = await makeCard({ title, subtitle, avatarUrl, bgUrl, badgeUrl })
  const file = path.join(tmp, `${type}-${Date.now()}.png`)
  fs.writeFileSync(file, buff)
  const mentionId = participant ? [participant] : []
  const handle = participant ? `@${String(participant).split('@')[0]}` : userName
  await conn.sendMessage(jid, { image: { url: file }, caption: `${title} ${handle}`, mentions: mentionId })
  return file
}

export default { makeCard, sendWelcomeOrBye }
