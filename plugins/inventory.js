import { readUsersDb } from '../lib/database.js';
import { shopItems } from '../lib/shop-items.js';

const inventoryCommand = {
  name: "inventory",
  category: "economia",
  description: "Muestra los artículos que posees.",
  aliases: ["inv"],

  async execute({ sock, msg }) {
    const senderId = msg.sender;
    const usersDb = readUsersDb();
    const user = usersDb[senderId];

    if (!user) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No estás registrado. Usa el comando `reg` para registrarte." }, { quoted: msg });
    }

    if (!user.inventory || Object.keys(user.inventory).length === 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Tu inventario está vacío. Usa el comando `buy` para comprar artículos." }, { quoted: msg });
    }

    let inventoryMessage = "🎒 *Tu Inventario*\n\n";

    for (const itemId in user.inventory) {
      const item = shopItems.find(i => i.id === itemId);
      const quantity = user.inventory[itemId];

      if (item) {
        inventoryMessage += `*${item.name}* x${quantity}\n`;
        inventoryMessage += `> _${item.description}_\n\n`;
      }
    }

    await sock.sendMessage(msg.key.remoteJid, { text: inventoryMessage }, { quoted: msg });
  }
};

export default inventoryCommand;
