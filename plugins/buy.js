import { readUsersDb, writeUsersDb } from '../lib/database.js';
import { shopItems } from '../lib/shop-items.js';

const buyCommand = {
  name: "buy",
  category: "economia",
  description: "Compra un artículo de la tienda.",

  async execute({ sock, msg, args }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    const itemId = args[0];
    if (!itemId) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, especifica el ID del artículo que quieres comprar. Usa el comando `shop` para ver los artículos." }, { quoted: msg });
    }

    const itemToBuy = shopItems.find(item => item.id.toLowerCase() === itemId.toLowerCase());

    if (!itemToBuy) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No se encontró ningún artículo con el ID "${itemId}".` }, { quoted: msg });
    }

    if (user.coins < itemToBuy.price) {
      return sock.sendMessage(msg.key.remoteJid, { text: `No tienes suficientes monedas para comprar "${itemToBuy.name}". Necesitas ${itemToBuy.price} coins, pero solo tienes ${user.coins}.` }, { quoted: msg });
    }

    // Inicializar inventario si no existe
    if (!user.inventory) {
      user.inventory = {};
    }

    // Restar monedas y añadir artículo al inventario
    user.coins -= itemToBuy.price;
    user.inventory[itemToBuy.id] = (user.inventory[itemToBuy.id] || 0) + 1; // Añade o incrementa la cantidad

    writeUsersDb(usersDb);

    const successMessage = `🎉 ¡Has comprado "${itemToBuy.name}" por ${itemToBuy.price} coins!\n` +
                           `Tu nuevo saldo es de ${user.coins} coins.\n` +
                           `Usa el comando \`inventory\` para ver tus artículos.`;

    await sock.sendMessage(msg.key.remoteJid, { text: successMessage }, { quoted: msg });
  }
};

export default buyCommand;
