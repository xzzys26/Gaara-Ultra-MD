import { readSettingsDb, writeSettingsDb } from '../lib/database.js'

const nableCommand = {
  name: 'nable',
  aliases: [
    'enable','disable','on','off',
    // expose only these as direct commands to avoid conflicts
    'welcome','bye'
  ],
  category: 'grupos',
  description: 'Activa/Desactiva funciones por chat o globales',

  async execute({ sock, msg, args, isOwner, commandName }) {
    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    // If invoked via direct feature command (e.g., 'welcome'), infer sub from commandName
    const invoked = (commandName || '').toLowerCase()
    const isDirectFeature = ['welcome','bye'].includes(invoked)
    const sub = isDirectFeature ? invoked : (args[0] || '').toLowerCase()
    const onOff = isDirectFeature ? (args[0] || '').toLowerCase() : (args[1] || '').toLowerCase()

    if (!sub) {
  return sock.sendMessage(from, { text: 'Usa: welcome on | welcome off | bye on | bye off' }, { quoted: msg })
    }

    const enable = /^(on|true|1|enable|activar)$/i.test(onOff)
    const disable = /^(off|false|0|disable|desactivar)$/i.test(onOff)
    if (!enable && !disable) {
      return sock.sendMessage(from, { text: 'Indica on/off. Ej: welcome on' }, { quoted: msg })
    }

    const settings = readSettingsDb()
    if (!settings[from]) settings[from] = {}

    const requireAdmin = async () => {
      try {
        const md = await sock.groupMetadata(from)
        const senderId = msg.key.participant || msg.key.remoteJid
        const p = md.participants.find(x => x.id === senderId)
        const isAdmin = !!p?.admin
        if (!isAdmin && !isOwner) {
          await sock.sendMessage(from, { text: 'Se requieren permisos de administrador.' }, { quoted: msg })
          return false
        }
        return true
      } catch {
        await sock.sendMessage(from, { text: 'No se pudieron verificar permisos.' }, { quoted: msg })
        return false
      }
    }

    const set = (key) => {
      settings[from][key] = enable
      writeSettingsDb(settings)
      return sock.sendMessage(from, { text: `✔ ${key} ${enable ? 'activado' : 'desactivado'}.` }, { quoted: msg })
    }

    // Mapa de opciones -> clave y si requiere admin
    const map = {
      welcome: { key: 'welcome', admin: true },
      bye: { key: 'bye', admin: true },
      antilink: { key: 'antilink', admin: true },
      modoadmin: { key: 'adminMode', admin: true },
      detect: { key: 'detect', admin: true },
      autosticker: { key: 'autoSticker', admin: true },
      antiviewonce: { key: 'antiviewonce', admin: true },
      antisticker: { key: 'antiSticker', admin: true },
      antiraid: { key: 'antiRaid', admin: true },
      chatbot: { key: 'chatbot', admin: true },
      nsfw: { key: 'nsfw', admin: true },
      antitoxic: { key: 'antitoxic', admin: true },
      antifake: { key: 'antifake', admin: true },
      delete: { key: 'delete', admin: true },
      antilink2: { key: 'antiBot2', admin: true },
      antibot: { key: 'antiBot', admin: true },
      onlypv: { key: 'onlyPv', admin: false },
      onlygp: { key: 'onlyGp', admin: false },
      antiperu: { key: 'antiperu', admin: true },
    }

    const globalMap = {
      antiprivado: 'antiPrivate',
      antispam: 'antiSpam',
      restrict: 'restrict',
      anticall: 'antiCall',
      autoread: 'autoread',
      public: 'public',
      jadibotmd: 'jadibotmd',
    }

    if (globalMap[sub]) {
      if (!isOwner) return sock.sendMessage(from, { text: 'Opción solo para el propietario.' }, { quoted: msg })
      const botKey = '__bot__'
      if (!settings[botKey]) settings[botKey] = {}
      settings[botKey][globalMap[sub]] = enable
      writeSettingsDb(settings)
      return sock.sendMessage(from, { text: `✔ ${sub} ${enable ? 'activado' : 'desactivado'} (global).` }, { quoted: msg })
    }

    if (!isGroup) {
      return sock.sendMessage(from, { text: 'Esta opción es para grupos.' }, { quoted: msg })
    }

    const opt = map[sub]
    if (!opt) {
      return sock.sendMessage(from, { text: 'Opción no válida.' }, { quoted: msg })
    }

    if (opt.admin) {
      const ok = await requireAdmin()
      if (!ok) return
    } else if (!isOwner) {
      return sock.sendMessage(from, { text: 'Opción solo para el propietario.' }, { quoted: msg })
    }

    return set(opt.key)
  }
}

export default nableCommand
