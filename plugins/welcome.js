const welcomeCommand = {
  // Nombre del comando
  name: "welcome",

  // Categoría
  category: "grupos",

  // Descripción
  description: "Envía un mensaje de bienvenida con avatar y texto personalizado al entrar al grupo.",

  // Función principal
  async execute({ sock, msg, args, commands, config, participant, updateType }) {
    const groupId = msg.key.remoteJid

    // Configuración por grupo
    if (!config.groupSettings) config.groupSettings = {}
    if (!config.groupSettings[groupId]) config.groupSettings[groupId] = {
      enabled: true,
      welcomeText: "Hola {user}, bienvenido a {group}!"
    }
    const settings = config.groupSettings[groupId]

    // Comandos para activar/desactivar o cambiar texto
    if (args[0] === "on") {
      settings.enabled = true
      return await sock.sendMessage(groupId, { text: "✅ Bienvenida activada." }, { quoted: msg })
    }
    if (args[0] === "off") {
      settings.enabled = false
      return await sock.sendMessage(groupId, { text: "❌ Bienvenida desactivada." }, { quoted: msg })
    }
    if (args[0] === "set") {
      const newText = args.slice(2).join(" ")
      if (args[1] === "welcome") {
        settings.welcomeText = newText
        return await sock.sendMessage(groupId, { text: "✅ Texto de bienvenida actualizado." }, { quoted: msg })
      }
    }

    if (!settings.enabled) return

    // Detectar tipo de evento
    const type = updateType === "add" ? "welcome" : updateType === "remove" ? "bye" : "welcome"
    const userName = participant ? participant.split("@")[0] : "Usuario"
    const groupName = "este grupo"

    // Crear mensaje de bienvenida
    const text = settings.welcomeText.replace("{user}", userName).replace("{group}", groupName)

    // Enviar mensaje
    await sock.sendMessage(groupId, { text, mentions: participant ? [participant] : [] })
  }
}

export default welcomeCommand