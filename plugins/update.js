import { execSync } from 'child_process';

const updateCommand = {
  name: "update",
  aliases: ["actualizar", "up"],
  category: "propietario",
  description: "Actualiza el bot a la última versión desde el repositorio de GitHub.",

  async execute({ sock, msg, args = [], isOwner }) {
    if (!isOwner) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
      return;
    }

    try {
      const cmd = 'git pull' + (args.length ? ' ' + args.join(' ') : '');
      const output = execSync(cmd).toString();
      const upToDate = /Already up to date\.?|Ya está actualizado\.?/i.test(output);
      const response = upToDate
        ? `🌟 *¡Bot Actualizado!* 🌟\n\n✅ Ya estás al día con la última versión.\n\n🚀 ¡Todo listo para seguir funcionando!`
        : `🔄 *Actualización Aplicada!* 🔄\n\n📦 Se han aplicado los siguientes cambios:\n\n${output}\n\n✨ ¡El bot está ahora más potente que nunca!`;
      await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    } catch (error) {
      // Intentar detectar conflictos o cambios locales
      try {
        const status = execSync('git status --porcelain').toString().trim();
        if (status) {
          const conflictedFiles = status.split('\n').filter(line =>
            !line.includes('auth_info_baileys/') &&
            !line.includes('subbots/') &&
            !line.includes('.cache/') &&
            !line.includes('tmp/')
          );
          if (conflictedFiles.length > 0) {
            const conflictMsg = `⚠️ Conflictos detectados en los siguientes archivos:\n\n` +
              conflictedFiles.map(f => '• ' + f.slice(3)).join('\n') +
              `\n\n🔹 Para solucionarlo, resuelve los conflictos o actualiza manualmente.`;
            return await sock.sendMessage(msg.key.remoteJid, { text: conflictMsg }, { quoted: msg });
          }
        }
      } catch {}
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: `❌ Error al actualizar: ${error?.message || 'Error desconocido.'}` },
        { quoted: msg }
      );
    }
  }
};

export default updateCommand;
