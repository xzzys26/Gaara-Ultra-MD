// Handler invocar estilo Gaara-Ultra-MD con rayo y título actualizado
let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');

  const participantes = groupMetadata?.participants || [];
  const mencionados = participantes.map(p => p.id).filter(Boolean);

  // Lista de usuarios con rayo
  let listaUsuarios = mencionados.map(jid => `┃ ⚡ @${jid.split('@')[0]}`).join('\n');

  // Mensaje con decoración Gaara-Ultra-Invocación
  const mensaje = [
    '╭━━━〔 *Gaara-Ultra-Invocación* 〕━━━⬣',
    '┃ ⚡ ¡Invocación completada! ⚡',
    '┃ 🔊 Todos los guerreros del chat han sido invocados:',
    listaUsuarios,
    '╰━━━━━━━━━━━━━━━━━━━━⬣'
  ].join('\n');

  // Enviar mensaje mencionando a todos
  await conn.sendMessage(m.chat, { text: mensaje, mentions: mencionados }, { quoted: m });
};

handler.command = ['invocar', 'hidetag', 'tag'];
handler.help = ['invocar'];
handler.tags = ['grupos'];

export default handler;