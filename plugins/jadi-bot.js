// código creado x The Carlos 👑 y Modificado Por Xzzys26 Para Gaara-Ultra-MD 
async function handler(m, { conn: stars, usedPrefix }) {
  const maxSubBots = 324;
  const conns = Array.isArray(global.conns) ? global.conns : [];

  const isConnOpen = (c) => {
    try {
      return c?.ws?.socket?.readyState === 1;
    } catch {
      return !!c?.user?.id;
    }
  };

  const unique = new Map();
  for (const c of conns) {
    if (!c || !c.user) continue;
    if (!isConnOpen(c)) continue;

    const jidRaw = c.user.jid || c.user.id || '';
    if (!jidRaw) continue;

    unique.set(jidRaw, c);
  }

  const users = [...unique.values()];
  const totalUsers = users.length;
  const availableSlots = Math.max(0, maxSubBots - totalUsers);

  const packname = global.packname || '⚡️ 𝙂𝘼𝘼𝙍𝘼 𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 ⚡';
const title = `⚡『 𝙎𝙐𝘽-𝘽𝙊𝙏𝙎 𝙊𝙉𝙇𝙄𝙉𝙀 』⚡`;
const barra = '━━━━━━━━━━━━━━━━━━━━━━';

let responseMessage = '';

if (totalUsers === 0) {
  responseMessage = `╭━━━〔 *${title}* 〕━━━╮
┃ ⚡ Sub-Bots activos: *0*
┃ ❌ Nadie conectado todavía
┃ 📜 Espacios disponibles: *${availableSlots}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

> 📌 Conéctate ahora y forma parte de la red Ultra.`;
} else if (totalUsers <= 15) {
  const listado = users
    .map((v, i) => {
      const num = v.user.jid.replace(/[^0-9]/g, '');
      const nombre = v?.user?.name || v?.user?.pushName || '🌟 𝙎𝙪𝙗-𝘽𝙤𝙩𝙨';
      const waLink = `https://wa.me/${num}?text=${usedPrefix}code`;
      return `╭━━━〔 ⚡ 𝙎𝙐𝘽-𝘽𝙊𝙏𝙎 𝙐𝙇𝙏𝙍𝘼 #${i + 1} 〕━━━╮
┃ 👤 Usuario: @${num}
┃ ⚡️ Nombre: ${nombre}
┃ 🔗 Link: ${waLink}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;
    })
    .join('\n\n');

  responseMessage = `╭━━━〔 *${title}* 〕━━━╮
┃ 📜 Total conectados: *${totalUsers}*
┃ ⚡ Espacios disponibles: *${availableSlots}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

${listado}`.trim();
} else {
  responseMessage = `╭━━━〔 *${title}* 〕━━━╮
┃ 📜 Total conectados: *${totalUsers}*
┃ ⚡ Espacios disponibles: *${availableSlots}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

⚠️ _Hay demasiados subbots conectados, no se puede mostrar la lista completa._`;
}


  const imageUrl = 'https://qu.ax/RRMde.jpg'; // Cambia si quieres

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo",
    },
    message: {
      contactMessage: {
        displayName: "Subbot",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Subbot;;;\nFN:Subbot\nEND:VCARD",
      },
    },
  };

  const mentions = typeof stars.parseMention === 'function'
    ? stars.parseMention(responseMessage)
    : [...new Set(
        (responseMessage.match(/@(\d{5,16})/g) || []).map(v => v.replace('@', '') + '@s.whatsapp.net')
      )];

  try {
    await stars.sendMessage(
      m.chat,
      { image: { url: imageUrl }, caption: responseMessage, mentions },
      { quoted: fkontak }
    );
  } catch (e) {
    console.error('❌ Error enviando listado de subbots:', e);
    await stars.sendMessage(
      m.chat,
      { text: responseMessage, mentions },
      { quoted: fkontak }
    );
  }
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['jadibot'];
export default handler;