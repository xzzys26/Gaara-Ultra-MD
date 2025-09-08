import { exec } from 'child_process';

const updateCommand = {
  name: "update",
  category: "propietario",
  description: "Actualiza el bot a la última versión desde el repositorio de GitHub.",

  async execute({ sock, msg, config }) {
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderJid.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
      return;
    }

    await sock.sendMessage(msg.key.remoteJid, { text: "Iniciando actualización... Descargando los últimos cambios desde GitHub." }, { quoted: msg });

    exec('git pull', async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error en git pull: ${error.message}`);
        await sock.sendMessage(msg.key.remoteJid, { text: `Ocurrió un error durante la actualización:\n\n${error.message}` }, { quoted: msg });
        return;
      }
      if (stderr) {
         // git pull a menudo usa stderr para mensajes de estado, así que lo tratamos como info
        console.log(`Git stderr: ${stderr}`);
      }

      if (stdout.includes("Already up to date.") || stdout.includes("Ya está actualizado.")) {
        await sock.sendMessage(msg.key.remoteJid, { text: "El bot ya está en la última versión. No hay actualizaciones pendientes." }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: `*Actualización completada.*\n\n\`\`\`${stdout}\`\`\`\n\nReiniciando el bot para aplicar los cambios...` }, { quoted: msg });
        // Usamos un pequeño timeout para dar tiempo a que el mensaje se envíe antes de cerrar el proceso
        setTimeout(() => {
          process.exit(0);
        }, 3000); // 3 segundos
      }
    });
  }
};

export default updateCommand;
