import { shopItems } from '../lib/shop-items.js';

const shopCommand = {
  name: "shop",
  category: "economia",
  description: "Muestra la tienda de artículos.",
  aliases: ["tienda"],

  async execute({ sock, msg }) {
    let shopMessage = "🛍️ *Tienda de Artículos* 🛍️\n\n";
    shopMessage += "Usa el comando `buy <ID del item>` para comprar.\n\n";

    shopItems.forEach(item => {
      shopMessage += `*${item.name}* - Precio: *${item.price} coins*\n`;
      shopMessage += `> (ID: \`${item.id}\`) _${item.description}_\n\n`;
    });

    await sock.sendMessage(msg.key.remoteJid, { text: shopMessage }, { quoted: msg });
  }
};

export default shopCommand;
