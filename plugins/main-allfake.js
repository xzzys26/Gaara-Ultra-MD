import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
const { proto } = pkg

var handler = m => m

handler.all = async function (m, { conn }) {

    // --- Función para buffers ---
    global.getBuffer = async function (url, options = {}) {
        try {
            const res = await axios({ method: "get", url, responseType: 'arraybuffer', ...options })
            return res.data
        } catch (e) { console.log(`Error getBuffer: ${e}`) }
    }

    // --- Fake / Canal ---
    global.canalIdM = ["120363341909397115@newsletter"]
    global.canalNombreM = ["GaaraUltra-MD UpdateBot"]

    async function getRandomChannel() {
        const idx = Math.floor(Math.random() * canalIdM.length)
        return { id: canalIdM[idx], name: canalNombreM[idx] }
    }

    global.channelRD = await getRandomChannel()

    global.rcanal = { 
        contextInfo: { 
            isForwarded: true, 
            forwardedNewsletterMessageInfo: { 
                newsletterJid: channelRD.id, 
                serverMessageId: 100, 
                newsletterName: channelRD.name 
            },
            externalAdReply: { 
                showAdAttribution: true, 
                title: 'GaaraUltra-MD, 
                body: 'By Erenxz', 
                mediaUrl: null, 
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: 'https://cdn.russellxz.click/9a7a4311.jpeg',
                sourceUrl: 'https://github.com/imoXzzy'
            },
        },
    }
}

export default handler