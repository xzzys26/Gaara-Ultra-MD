// creado Por Xzzys26 Adaptado Para Gaara-Ultra-MD 

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

  await conn.sendMessage(m.chat, { text: mensaje, mentions: mencionados }, { quoted: m });
};

handler.command = ['invocar', 'hidetag', 'tag'];
handler.help = ['invocar'];
handler.tags = ['grupos'];

export default handler;