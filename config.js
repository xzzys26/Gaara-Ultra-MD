import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.creador = [
  ['18493907272', 'Xzzys26', true],
]

global.owner = [
// <-- Número @s.whatsapp.net -->
  ['18493907272', 'Xzzys26 Creador', true],
  ['5216641784469'],

// <-- Número @lid -->
  ['', 'BrayanOFC, true],
  ['258892692984006', 'DevAlexJs', true], 
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['18493907272'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17'  
global.languaje = 'Español'
global.vs = '2.13.2'
global.vsJB = '5.0'
global.nameqr = 'Gaara-Ultra-MD' 
global.namebot = 'Gaara-Ultra-MD'
global.vegetasessions = 'Gaara Session'
global.jadi = 'JadiBots' 
global.vegetaJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = `Xzzys26 Gaara-Ultra-MD`
global.botname = '𝗚𝗔𝗔𝗥𝗔 𝗨𝗟𝗧𝗥𝗔-𝗠𝗗'
global.dev = '𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚇𝚉𝚉𝚂𝚈26'
global.textbot = '𝐁𝐲 𝐗𝐳𝐳𝐲𝐬26 𝐆𝐚𝐚𝐫𝐚 𝐔𝐥𝐭𝐫𝐚-𝐌𝐃'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'coin'
global.welcom1 = '𝙀𝙙𝙞𝙩𝙖 𝘾𝙤𝙣 𝙀𝙡 𝘾𝙤𝙢𝙖𝙣𝙙𝙤 𝙎𝙚𝙩𝙬𝙚𝙡𝙘𝙤𝙢𝙚'
global.welcom2 = '𝙀𝙙𝙞𝙩𝙖 𝘾𝙤𝙣 𝙀𝙡 𝘾𝙤𝙢𝙖𝙣𝙙𝙤 𝙎𝙚𝙩𝙗𝙮𝙚'
global.banner = 'https://files.catbox.moe/j0z1kz.jpg'
global.catalogo = 'https://files.catbox.moe/j0z1kz.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒──ׄ─ׅ─ׄ─

global.gp1 = 'https://chat.whatsapp.com/HaKf6ezcwdbGzmH782eBal?mode=r_c'
global.comunidad1 = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
global.channel = 'https://whatsapp.com/channel/0029Vb5yFNP72WU14BQqel1V'
global.channel2 = 'https://whatsapp.com/channel/0029Vb5yFNP72WU14BQqel1V'
global.md = 'https://github.com/xzzys26/Gaara-Ultra-MD.git'
global.correo = 'erenxz01@gmail.com'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// global.catalogo = fs.readFileSync('./src/catalogo.jpg')
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: global.packname, orderTitle: 'Bang', thumbnail: global.catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363394965381607@newsletter',
ch2: "120363394965381607@newsletter",
ch3: "120363394965381607@newsletter"
}
global.multiplier = 60

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
