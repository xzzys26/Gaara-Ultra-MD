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
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, ingrese el nombre de la apk para buscar." }, { quoted: msg });
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

    const waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🔎 Buscando "${text}" en Aptoide...` }, { quoted: msg });

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

      let caption = `*乂  APTOIDE - DESCARGAS* 乂\n\n`;
      caption += `☁️ *Nombre*: ${appInfo.name}\n`;
      caption += `📦 *Package*: ${appInfo.package}\n`;
      caption += `⬆️ *Actualizado*: ${appInfo.lastup}\n`;
      caption += `⚖️ *Peso*: ${appInfo.size}\n\n`;
      caption += `💸 *Costo:* 200 coins.`;

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
