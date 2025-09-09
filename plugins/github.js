import axios from 'axios';

const githubCommand = {
  name: "github",
  category: "informacion",
  description: "Busca información de un perfil de GitHub.",

  async execute({ sock, msg, args }) {
    const username = args[0];
    if (!username) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona un nombre de usuario de GitHub." }, { quoted: msg });
    }

    try {
      const apiUrl = `https://api.github.com/users/${username}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.login) {
        throw new Error("Usuario no encontrado");
      }

      const message = `
╭━━━〔 *💻 Información de GitHub 💻* 〕━━━╮

➺ *👤 Nombre:* ${data.name || 'N/A'}
➺ *🔖 Usuario:* ${data.login}
➺ *📝 Biografía:* ${data.bio || 'N/A'}
➺ *👥 Seguidores:* ${data.followers}
➺ *👣 Siguiendo:* ${data.following}
➺ *📚 Repositorios Públicos:* ${data.public_repos}
➺ *📍 Ubicación:* ${data.location || 'N/A'}

➺ *🔗 URL:* ${data.html_url}

╰━━━〔 *🛠 Gaara Ultra MD 🛠* 〕━━━╯
`;

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: data.avatar_url },
        caption: message
      }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando github:", e.message);
      await sock.sendMessage(msg.key.remoteJid, { text: `No se pudo encontrar al usuario de GitHub: *${username}*` }, { quoted: msg });
    }
  }
};

export default githubCommand;
