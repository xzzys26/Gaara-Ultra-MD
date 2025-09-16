//codigo creado por BrayanOFC 
// plugins/welcome.js
// Nota: usa conn.sendMessage que es más simple y fiable
const links = {
  welcome: 'https://qu.ax/SfjSV.png',
  bye: 'https://qu.ax/Rddry.png'
}

export async function welcomeHandler(conn, update) {
  try {
    console.log('[welcomeHandler] recibí update ->', update)

    const { id, participants, action } = update
    if (!id || !participants || !action) {
      console.log('[welcomeHandler] update incompleto, saliendo')
      return
    }

    for (const participant of participants) {
      const username = participant.split('@')[0] // ejemplo: 521234567890@s.whatsapp.net -> 521234567890

      if (action === 'add') {
        const caption = `👋 Bienvenido @${username}\nLee las reglas y preséntate 😉`
        await conn.sendMessage(
          id,
          { image: { url: links.welcome }, caption },
          { mentions: [participant] }
        )
        console.log(`[welcomeHandler] enviado bienvenida a ${participant} en ${id}`)

      } else if (action === 'remove') {
        const caption = `💀 Nadie te quiso @${username}`
        await conn.sendMessage(
          id,
          { image: { url: links.bye }, caption },
          { mentions: [participant] }
        )
        console.log(`[welcomeHandler] enviado despedida a ${participant} en ${id}`)

      } else if (action === 'promote' || action === 'demote') {
        // opcional: manejas promociones/demotes si quieres
        console.log(`[welcomeHandler] acción ${action} para ${participant}`)
      } else {
        console.log('[welcomeHandler] acción desconocida:', action)
      }
    }
  } catch (e) {
    console.error('[welcomeHandler] error ->', e)
  }
}