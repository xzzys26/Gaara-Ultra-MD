import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo harem.json.')
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    // Cooldown de 15 minutos
    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return conn.sendMessage(m.chat, { text: `《✧》Debes esperar ${seconds} segundos* para usar *#rw* de nuevo.` }, { quoted: m })
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)

        const statusMessage = randomCharacter.user 
            ? `Reclamado por @${randomCharacter.user.split('@')[0]}` 
            : 'Libre'

        const message = `📃 Nombre » *${randomCharacter.name}*
🌸 Género » *${randomCharacter.gender}*
💰 Valor » *${randomCharacter.value}*
📌 Estado » ${statusMessage}
🧬 Fuente » *${randomCharacter.source}*
🆔️ ID: *${randomCharacter.id}*`

        // Menciones si ya está reclamado
        const mentions = userEntry ? [userEntry.userId] : []

        // Enviar imagen con texto
        await conn.sendMessage(m.chat, {
            image: { url: randomImage },
            caption: message,
            mentions
        }, { quoted: m })

        // Si está libre, actualizar archivo
        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        // Cooldown 15 minutos
        cooldowns[userId] = now + 15 * 1000

    } catch (error) {
        conn.sendMessage(m.chat, { text: `✘ Error al cargar el personaje: ${error.message}` }, { quoted: m })
    }
}

handler.help = ['rw', 'ver', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['rw', 'ver', 'rollwaifu']
handler.group = true

export default handler