import fetch from 'node-fetch'
import AdmZip from 'adm-zip'
import { Buffer } from 'buffer'

let handler = async (m, { conn }) => {
if (!m.quoted) return conn.reply(m.chat, '❀ Debes citar un archivo .zip para subirlo.', m)
await m.react('🕒')
const quoted = m.quoted
try {
const zipBuffer = await quoted.download()
if (!zipBuffer) return conn.reply(m.chat, 'ꕥ No se pudo descargar el archivo.', m)
const zip = new AdmZip(zipBuffer)
const entries = zip.getEntries()
for (const entry of entries) {
if (entry.isDirectory) continue
const filePath = entry.entryName
const fileContent = entry.getData()
const result = await uploadFileToGitHub(filePath, fileContent, m, conn)
if (!result.ok) {
await conn.reply(m.chat, `⚠︎ Falló: ${filePath} → ${result.status} ${result.statusText}`, m)
}}
await conn.reply(m.chat, `❀ Subida completada: ${entries.length} archivos.`, m)
await m.react('✔️')
} catch (err) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Error interno: ${err.message}`, m)
}}

handler.help = ['zip']
handler.tags = ['tools']
handler.command = ['zip']
handler.rowner = true;

export default handler

async function uploadFileToGitHub(filePath, fileContent, m, conn) {
const token = '' // token de acceso 
const repoOwner = '' // nombre de usuario 
const repoName = '' // nombre del repo 
const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`
const existing = await fetch(url, { method: 'GET', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }})
const content = Buffer.from(fileContent).toString('base64')
const json = existing.ok ? await existing.json() : null
const sha = json?.sha
const body = { message: 'Yuki-WaBot|Made By Destroy', content: Buffer.from(fileContent).toString('base64'), ...(sha ? { sha } : {}) }
const response = await fetch(url, { method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
return response
}