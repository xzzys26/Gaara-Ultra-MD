import { readUsersDb, writeUsersDb } from '../lib/database.js';
import { shopItems } from '../lib/shop-items.js';

const useCommand = {
  name: "use",
  category: "economia",
  description: "Usa un artículo de tu inventario.",
  aliases: ["usar"],

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado." }, { quoted: msg });
    }

    const itemIdToUse = args[0]?.toLowerCase();
    if (!itemIdToUse) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Especifica el ID del artículo que quieres usar. Ejemplo: `use suerte`" }, { quoted: msg });
    }

    if (!user.inventory || !user.inventory[itemIdToUse] || user.inventory[itemIdToUse] < 1) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No tienes "${itemIdToUse}" en tu inventario.` }, { quoted: msg });
    }

    const item = shopItems.find(i => i.id === itemIdToUse);
    if (!item) {
        // This case should be rare if inventory is managed properly
        return sock.sendMessage(msg.key.remoteJid, { text: "Parece que tienes un artículo fantasma. No se puede usar." }, { quoted: msg });
    }

    // --- Lógica para cada artículo consumible ---
    let effectApplied = false;
    let effectMessage = "";

    if (itemIdToUse === 'suerte') {
      if (!user.effects) user.effects = {};
      const twentyFourHours = 24 * 60 * 60 * 1000;
      user.effects.suerte = Date.now() + twentyFourHours;
      effectApplied = true;
      effectMessage = "¡Has usado una Poción de Suerte! Tu probabilidad de éxito en los robos ha aumentado por 24 horas.";
    } else {
      return sock.sendMessage(msg.key.remoteJid, { text: `El artículo "${item.name}" no es un consumible o su efecto aún no ha sido implementado.` }, { quoted: msg });
    }

    if (effectApplied) {
      // Decrementar o eliminar el artículo del inventario
      user.inventory[itemIdToUse] -= 1;
      if (user.inventory[itemIdToUse] <= 0) {
        delete user.inventory[itemIdToUse];
      }

      writeUsersDb(usersDb);
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ ${effectMessage}` }, { quoted: msg });
    }
  }
};

export default useCommand;
