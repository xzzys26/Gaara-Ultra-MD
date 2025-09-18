let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');

  const participantes = groupMetadata?.participants || [];
  const mencionados = participantes.map(p => p.id).filter(Boolean);

  let listaUsuarios = mencionados.map(jid => `┃ ⚡ @${jid.split('@')[0]}`).join('\n');

  const mensaje = [
    '╭━━━〔 *Gaara-Ultra-Invocación* 〕━━━⬣',
    '┃ 🔥 ¡Invocación completada! 🔥',
    '┃ 📌 Todos los usuarios del chat han sido invocados:',
    listaUsuarios,
    '╰━━━━━━━━━━━━━━━━━━━━⬣'
  ].join('\n');

  const imagenURL = 'https://files.catbox.moe/cnl455.jpg';

  await conn.sendMessage(
    m.chat,
    { 
      image: { url: imagenURL },
      caption: mensaje,
      mentions: mencionados
    },
    { quoted: m }
  );

  await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } });
};

handler.command = ['invocar', 'hidetag', 'tag'];
handler.help = ['invocar'];
handler.tags = ['grupos'];

export default handler;