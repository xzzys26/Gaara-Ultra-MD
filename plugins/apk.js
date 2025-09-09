import { search, download } from 'aptoide-scraper';
import { readUsersDb, writeUsersDb } from '../lib/database.js';
import axios from 'axios';

const apkCommand = {
  name: "apk",
  category: "descargas",
  description: "Busca y descarga una aplicación desde Aptoide. Cuesta 200 coins.",
  aliases: ["modapk", "aptoide"],

  async execute({ sock, msg, args }) {
    const text = args.join(' ');
    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, { text: "𝙋𝙤𝙧𝙛𝙫𝙤𝙧 𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙀𝙡 𝙉𝙤𝙢𝙗𝙧𝙚 𝘿𝙚𝙡 𝘼𝙥𝙠 𝙌𝙪𝙚 𝙌𝙪𝙞𝙚𝙧𝙚𝙨 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙨𝙧 ✨" }, { quoted: msg });
    }

    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];
    const cost = 200;

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    if (user.coins < cost) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No tienes suficientes monedas para usar este comando. Necesitas ${cost} coins, pero solo tienes ${user.coins}.` }, { quoted: msg });
    }

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🔎 𝘽𝙪𝙨𝙘𝙖𝙣𝙙𝙤 𝘼𝙥𝙠 "${text}" en Aptoide...` }, { quoted: msg });

    try {
      const searchResults = await search(text);
      if (!searchResults || searchResults.length === 0) {
        throw new Error("No se encontraron resultados para tu búsqueda.");
      }

      const appInfo = await download(searchResults[0].id);
      if (!appInfo || !appInfo.dllink) {
        throw new Error("No se pudo obtener la información de descarga de la aplicación.");
      }

      // Cobrar solo si la descarga es posible
      user.coins -= cost;
      writeUsersDb(usersDb);

      let caption = `
╭━━━〔 *乂  APTOIDE - DESCARGAS 乂* 〕━━━╮

➺ ☁️ *Nombre:* ${appInfo.name}
➺ 📦 *Package:* ${appInfo.package}
➺ ⬆️ *Actualizado:* ${appInfo.lastup}
➺ ⚖️ *Peso:* ${appInfo.size}

➺ 💸 *Costo:* 200 coins

╰━━━〔 *🛠 Gaara Ultra MD 🛠* 〕━━━╯
`;

      await sock.sendMessage(msg.key.remoteJid, { image: { url: appInfo.icon }, caption: caption }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { text: "Enviando APK como documento..." }, { edit: waitingMsg.key });

      if (appInfo.size.includes('GB') || parseFloat(appInfo.size.replace(' MB', '')) > 150) {
        return sock.sendMessage(msg.key.remoteJid, { text: "El archivo es demasiado pesado para ser enviado (> 150 MB)." }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, {
        document: { url: appInfo.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${appInfo.name}.apk`
      }, { quoted: msg });

    } catch (error) {
      console.error("Error en el comando apk:", error);
      // No se devuelve el dinero si el error ocurre después de cobrar,
      // ya que el enlace de descarga se obtuvo, el fallo puede ser de WhatsApp.
      await sock.sendMessage(msg.key.remoteJid, { text: `Ocurrió un fallo: ${error.message}` }, { quoted: msg, edit: waitingMsg.key });
    }
  }
};

export default apkCommand;
