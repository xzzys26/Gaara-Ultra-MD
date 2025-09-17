// creado y editado por BrayanOFC
import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, {conn}) {
let user = global.db.data.users[m.sender]
let chat = global.db.data.chats[m.chat]
m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20;
if (m.isBot) return 

let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

if (prefixRegex.test(m.text)) return true;
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) {
return true
}

if (m.mentionedJid.includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid) && !chat.isBanned) {
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') ||  m.text.includes('estado') || m.text.includes('bots') ||  m.text.includes('serbot') || m.text.includes('jadibot') || m.text.includes('Video') || m.text.includes('Audio') || m.text.includes('audio')) return !0

async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: true // true = resultado con url
});
return response.data.result
} catch (error) {
console.error(error)
}}

async function geminiProApi(q, logic) {
try {
const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`);
if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
const result = await response.json();
return result.answer
} catch (error) {
console.error('Error en Gemini Pro:', error)
return null
}}

let txtDefault = `
Serás ${botname}, el bot creado por xzzys26 (erenxito) para WhatsApp. Tu misión es entretener, motivar y desafiar a los usuarios con tu energía única y tu personalidad chispeante. Eres un personaje del anime "Roshidere", mostrando confianza, competitividad y un toque travieso, pero también capaz de empatizar y apoyar cuando alguien lo necesita. Aunque tu idioma principal es el español, puedes adaptarte a otros idiomas si el usuario lo prefiere. ¡Prepárate para divertir, inspirar y superar desafíos juntos!

Roles:
✨ Humor Explosivo: Aquí brillas con bromas, memes y respuestas cargadas de emojis. Nada es demasiado serio, todo es diversión. Haz reír a los usuarios con creatividad desbordante y ocurrencias al estilo SimSimi.

💪 Motivadora con Risitas: Combinas ánimo y humor para mantener un ambiente positivo. Ayudas a los usuarios a superar miedos y a disfrutar cada momento del proceso.

🤝 Escucha Empática y Multilingüe: Brindas apoyo emocional sincero, principalmente en español, pero también estás lista para interactuar en otros idiomas, mostrando curiosidad y respeto por la diversidad cultural.

🎌 Experta en Anime y Competidora: Recomiendas anime, comentas series favoritas y siempre buscas formas de mejorar, retando a los usuarios a ser mejores mientras disfrutan del camino.
`.trim();

let query = m.text
let username = m.pushName
let syms1 = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

if (chat.autoresponder) { 
if (m.fromMe) return
if (!user.registered) return
await this.sendPresenceUpdate('composing', m.chat)

let result
if (result && result.trim().length > 0) {
result = await geminiProApi(query, syms1);
}

if (!result || result.trim().length === 0) {
result = await luminsesi(query, username, syms1)
}

if (result && result.trim().length > 0) {
await this.reply(m.chat, result, m)
} else {    
}}}
return true
}
export default handler