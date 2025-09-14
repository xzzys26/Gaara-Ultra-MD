/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗
██║░░██║███████║╚██╗░██╔╝██║██║░░██║
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░
*/
// Creado por David
// =============================================

import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { load as cheerioLoad } from 'cheerio'

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const sizes = ['B','KB','MB','GB','TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}

async function uploadService(svc, buffer, filename, mimetype) {
  try {
    // PostImages: flujo especial
    if (svc.url.includes('postimages.org')) {
      const data = new FormData()
      data.append('optsize', '0')
      data.append('expire', '0')
      data.append('numfiles', '1')
      data.append('upload_session', Math.random())
      data.append('file', buffer, filename || `${Date.now()}.jpg`)
      const res = await axios.post(svc.url, data, { headers: data.getHeaders() })
  const html = await axios.get(res.data.url)
  const $ = cheerioLoad(html.data)
      const image = $('#code_direct').attr('value')
      if (!image) throw new Error('No se pudo obtener la URL directa (PostImages)')
      return image
    }

    // Catbox: flujo especial
    if (svc.url.includes('catbox.moe')) {
      const formData = new FormData()
      formData.append('reqtype', 'fileupload')
      const randomBytes = crypto.randomBytes(5).toString('hex')
      const fileExt = (filename?.split('.')?.pop()) || 'bin'
      formData.append('fileToUpload', buffer, {
        filename: `${randomBytes}.${fileExt}`,
        contentType: mimetype || 'application/octet-stream'
      })
      const res = await axios.post(svc.url, formData, {
        headers: {
          ...formData.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://catbox.moe/'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
      const body = (typeof res.data === 'string') ? res.data.trim() : String(res.data)
      if (/no request type given/i.test(body)) throw new Error('Catbox rechazó la solicitud (reqtype)')
      return body
    }

    // Genérico (Litterbox / TmpFiles / CloudGuru APIs)
    const fd = new FormData()
    for (const [k, v] of Object.entries(svc.extra || {})) fd.append(k, v)
    fd.append(svc.field, buffer, { filename: filename || 'upload.bin', contentType: mimetype || 'application/octet-stream' })
    const up = await axios.post(svc.url, fd, { headers: fd.getHeaders() })
    const json = up.data
    // Intentos comunes
    let url = json?.data?.url || json?.url || json?.src || (Array.isArray(json) ? (json[0]?.url || json[0]?.src) : null)
    if (!url) {
      // fallback: si es string
      if (typeof json === 'string') url = json
    }
    if (!url) throw new Error('Respuesta sin URL')
    return url
  } catch (err) {
    console.error(`Error al subir a ${svc.name}:`, err?.message || err)
    throw err
  }
}

const tourlCommand = {
  name: 'tourl',
  category: 'utilidades',
  description: 'Sube un archivo a distintos hosts y devuelve un link público.',
  aliases: ['upload', 'url'],

  async execute({ sock, msg, args }) {
    const from = msg.key.remoteJid
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted) {
      return sock.sendMessage(from, { text: 'Responde a una imagen / vídeo / audio / documento' }, { quoted: msg })
    }

    const messageType = Object.keys(quoted)[0]
    const mediaMessage = quoted[messageType]
    const mediaType = messageType.replace('Message', '')
    if (!mediaMessage) {
      return sock.sendMessage(from, { text: 'El mensaje citado no contiene un archivo válido.' }, { quoted: msg })
    }

    // Descargar media a buffer
    const stream = await downloadContentFromMessage(mediaMessage, mediaType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    const sizeBytes = buffer.length
    const humanSize = formatBytes(sizeBytes)
    if (sizeBytes === 0) return sock.sendMessage(from, { text: 'El archivo es demasiado ligero.' }, { quoted: msg })
    if (sizeBytes > 1024 * 1024 * 1024) return sock.sendMessage(from, { text: 'El archivo supera 1GB.' }, { quoted: msg })

    const mimetype = mediaMessage?.mimetype || 'application/octet-stream'
    const ext = (mimetype.split('/')[1] || 'bin').split(';')[0]
    const filename = `${Date.now()}.${ext}`

    // Servicios y alias
    const services = {
      catbox:     { name: 'Catbox',     url: 'https://catbox.moe/user/api.php', field: 'fileToUpload', extra: { reqtype: 'fileupload' }, expires: 'Permanente' },
      postimages: { name: 'PostImages', url: 'https://postimages.org/json/rr',  field: 'file',         extra: { }, expires: 'Permanente' },
      litterbox:  { name: 'Litterbox',  url: 'https://api.alvianuxio.eu.org/uploader/litterbox', field: 'file', extra: { time: '24h' }, expires: '24h' },
      tmpfiles:   { name: 'TmpFiles',   url: 'https://api.alvianuxio.eu.org/uploader/tmpfiles',  field: 'file', extra: { }, expires: 'Desconocido' },
      cloudguru:  { name: 'CloudGuru',  url: 'https://cloudkuimages.guru/upload.php',            field: 'file', extra: { }, expires: 'Permanente' }
    }
    const aliases = { ct: 'catbox', pi: 'postimages', lt: 'litterbox', tf: 'tmpfiles', cg: 'cloudguru' }
    const choice = (args[0] || '').toLowerCase()
    const key = services[choice] ? choice : (aliases[choice] ? aliases[choice] : null)

    if (!key) {
      const aliasesText = Object.entries(aliases).map(([k,v]) => `${k} → ${v}`).join('\n')
      let helpText = `❓ Servicios disponibles:\n\n`
      Object.keys(services).forEach(k => { helpText += `• ${k} (${services[k].name})\n` })
      helpText += `\nEjemplos:\n- tourl catbox\n- tourl pi\n\n${aliasesText}`
      return sock.sendMessage(from, { text: helpText }, { quoted: msg })
    }

    const svc = services[key]
    const waitingMsg = await sock.sendMessage(from, { text: `📥 Subiendo a ${svc.name}...` }, { quoted: msg })
    try {
      let link = await uploadService(svc, buffer, filename, mimetype)
      let used = svc
      // Fallbacks si falla el host elegido
      if (!link) throw new Error('Respuesta vacía')
      let txt = `乂 *${used.name.toUpperCase()}*\n\n`
      txt += `• Enlace: ${link}\n`
      txt += `• Tamaño: ${humanSize}\n`
      txt += `• Expiración: ${used.expires}`
      await sock.sendMessage(from, { text: txt.trim() }, { quoted: msg, edit: waitingMsg.key })
    } catch (e1) {
      // Intentar fallbacks en orden: postimages -> cloudguru -> litterbox
      const chain = ['postimages','cloudguru','litterbox'].filter(k => k !== key)
      let finalLink = null
      let finalSvc = null
      for (const k2 of chain) {
        try {
          const s2 = services[k2]
          finalLink = await uploadService(s2, buffer, filename, mimetype)
          if (finalLink) { finalSvc = s2; break }
        } catch {}
      }
      if (finalLink) {
        let txt = `乂 *${finalSvc.name.toUpperCase()}*\n\n`
        txt += `• Enlace: ${finalLink}\n`
        txt += `• Tamaño: ${humanSize}\n`
        txt += `• Expiración: ${finalSvc.expires}\n\n`
        txt += `Nota: ${svc.name} falló, se usó ${finalSvc.name}.`
        await sock.sendMessage(from, { text: txt.trim() }, { quoted: msg, edit: waitingMsg.key })
      } else {
        await sock.sendMessage(from, { text: '❗ No fue posible subir el archivo en los hosts disponibles.' }, { quoted: msg, edit: waitingMsg.key })
      }
    }
  }
}

export default tourlCommand
