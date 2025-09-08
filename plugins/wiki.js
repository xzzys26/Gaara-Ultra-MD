import wiki from 'wikipedia';

const wikiCommand = {
  name: "wiki",
  category: "informacion",
  description: "Busca un resumen de un artículo en Wikipedia.",

  async execute({ sock, msg, args }) {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un término de búsqueda." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: `Buscando en Wikipedia: "${query}"...` }, { quoted: msg });

      // Configurar el idioma a español
      wiki.setLang('es');

      const page = await wiki.page(query);
      const summary = await page.summary();

      if (!summary) {
        throw new Error("No se encontró resumen.");
      }

      const message = `*Wikipedia: ${summary.title}*\n\n` +
                      `${summary.extract}\n\n` +
                      `*URL:* ${summary.content_urls.desktop.page}`;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando wiki:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo encontrar un artículo para: *${query}*` }, { quoted: msg });
    }
  }
};

export default wikiCommand;
