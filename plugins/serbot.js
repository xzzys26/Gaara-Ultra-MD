import Baileys, { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import NodeCache from 'node-cache'
import fs from 'fs'
import path from 'path'
import pino from 'pino'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (!Array.isArray(global.conns)) global.conns = []

const MAX_SUBBOTS = 20
const GLOBAL_KEY = '__bot__'
const IMAGE_URL = 'https://files.catbox.moe/3t09a3.png'

function buildQrCaption() {
  let r =  '✐ 𝐆𝐀𝐀𝐑𝐀-𝐕𝐈𝐍𝐂𝐔𝐋𝐀𝐂𝐈𝐎𝐍 𝐐𝐑 \n\n'
  r += '✐ *1.* Abre WhatsApp en otro dispositivo\n'
  r += '✐ *2.* Toca ⋮ > *WhatsApp Web*\n'
  r += '✐ *3.* Escanea este código QR\n\n'
  r += '✐ *Expira en 45 segundos*\n'
  r += '✐ *Nota:* Uso responsable del bot'
  return r
}

function buildCodeCaption() {
  let r =  '✐ 𝐆𝐀𝐀𝐑𝐀-𝐕𝐈𝐍𝐂𝐔𝐋𝐀𝐂𝐈𝐎𝐍 𝐂𝐎𝐃𝐄 \n\n'
  r += '✐ *1.* Ve a ⋮ > *Dispositivos*\n'
  r += '✐ *2.* Selecciona *Vincular*\n'
  r += '✐ *3.* Ingresa este código:\n\n'
  r += '✐ *Código:* 8 dígitos\n'
  r += '✐ *Válido por 60 segundos*\n'
  r += '✐ *Consejo:* Copia y pega rápido'
  return r
}

const serbotCommand = {
  name: 'qr',
  aliases: ['code'],
  category: 'subbots',
  description: 'Genera un QR o código de emparejamiento para crear un Sub-Bot',

  async execute({ sock, msg, args, isOwner, commandName }) {
    // Verificar si la función está habilitada globalmente
    try {
      const { readSettingsDb } = await import('../lib/database.js')
      const settings = readSettingsDb()
      const botCfg = settings[GLOBAL_KEY] || {}
      if (botCfg.jadibotmd === false && !isOwner) {
        return sock.sendMessage(msg.key.remoteJid, { text: 'La función de Sub-Bots está desactivada.' }, { quoted: msg })
      }
    } catch {}

    // Límite de sub-bots
    const active = global.conns.filter(c => c?.ws?.socket && c.ws.socket.readyState !== 3)
    if (active.length >= MAX_SUBBOTS) {
      return sock.sendMessage(msg.key.remoteJid, { text: 'No hay espacios disponibles para Sub-Bots en este momento.' }, { quoted: msg })
    }

    const invoked = (commandName || '').toLowerCase()
    const wantCode = invoked === 'code' || /^(code)$/i.test(args[0] || '')
    const who = (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) || msg.key.participant || msg.key.remoteJid
    const id = String(who).split('@')[0]
    const baseDir = path.resolve('./subbots')
    const authDir = path.join(baseDir, id)
    fs.mkdirSync(authDir, { recursive: true })

    // Permitir creds importadas como base64 en arg1
    const credsPath = path.join(authDir, 'creds.json')
    if (args[0] && !wantCode) {
      try {
        const parsed = JSON.parse(Buffer.from(args[0], 'base64').toString('utf8'))
        fs.writeFileSync(credsPath, JSON.stringify(parsed, null, 2))
      } catch {}
    }

    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    const msgRetryCache = new NodeCache()
    const logger = pino({ level: 'fatal' })
    const sub = Baileys.default({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      printQRInTerminal: false,
      logger,
      msgRetryCache,
      browser: wantCode ? ['Ubuntu','Chrome','110.0.5585.95'] : ['SubBot','Chrome','2.0.0'],
      generateHighQualityLinkPreview: true,
    })
    sub.ev.on('creds.update', saveCreds)

    // Si se pidió código, solicítalo apenas sea posible (al construir el socket)
    if (wantCode && !state.creds.registered) {
      try {
        let code = await sub.requestPairingCode(String(id))
        code = code.match(/.{1,4}/g)?.join('-')
        // Enviar imagen + caption y luego el código
        const cap = buildCodeCaption()
        const imgMsg = await sock.sendMessage(msg.key.remoteJid, { image: { url: IMAGE_URL }, caption: cap }, { quoted: msg })
        const codeMsg = await sock.sendMessage(msg.key.remoteJid, { text: code }, { quoted: msg })
        // Borrar mensajes tras 60s
        setTimeout(() => {
          try { if (imgMsg?.key) sock.sendMessage(msg.key.remoteJid, { delete: imgMsg.key }) } catch {}
          try { if (codeMsg?.key) sock.sendMessage(msg.key.remoteJid, { delete: codeMsg.key }) } catch {}
        }, 60000)
      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: 'No fue posible generar el código de emparejamiento.' }, { quoted: msg })
      }
    }

    let qrSent = false
    sub.ev.on('connection.update', async ({ connection, qr }) => {
      if (qr && !wantCode && !qrSent) {
        try {
          const buf = await qrcode.toBuffer(qr, { scale: 8 })
          const caption = buildQrCaption()
          const qrMsg = await sock.sendMessage(msg.key.remoteJid, { image: buf, caption }, { quoted: msg })
          qrSent = true
          setTimeout(() => { try { if (qrMsg?.key) sock.sendMessage(msg.key.remoteJid, { delete: qrMsg.key }) } catch {} }, 45000)
        } catch {
          await sock.sendMessage(msg.key.remoteJid, { text: 'No se pudo generar el QR.' }, { quoted: msg })
        }
      }
      if (connection === 'open') {
        global.conns.push(sub)
        await sock.sendMessage(msg.key.remoteJid, { text: `Sub-Bot para +${id} conectado.` }, { quoted: msg })
      }
    })
  }
}

export default serbotCommand
