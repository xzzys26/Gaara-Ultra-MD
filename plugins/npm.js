import axios from 'axios';

const npmCommand = {
  name: "npm",
  category: "informacion",
  description: "Busca información de un paquete de NPM.",

  async execute({ sock, msg, args }) {
    const packageName = args.join(' ');
    if (!packageName) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona el nombre de un paquete de NPM." }, { quoted: msg });
    }

    try {
      const apiUrl = `https://registry.npmjs.org/${packageName}`;
      const response = await axios.get(apiUrl);
      const data = response.data;
      const latestVersion = data['dist-tags'].latest;
      const versionData = data.versions[latestVersion];

      const message = `*📦 Información de NPM 📦*\n\n` +
                      `*🏷️ Nombre:* \`${data.name}\`\n` +
                      `*🚀 Versión:* ${latestVersion}\n` +
                      `*📄 Descripción:* ${data.description || 'N/A'}\n` +
                      `*📜 Licencia:* ${data.license || 'N/A'}\n` +
                      `*👤 Autor:* ${data.author?.name || 'N/A'}\n\n` +
                      `*🔗 Homepage:* ${data.homepage || 'N/A'}`;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando npm:", e.message);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo encontrar el paquete de NPM: *${packageName}*` }, { quoted: msg });
    }
  }
};

export default npmCommand;
