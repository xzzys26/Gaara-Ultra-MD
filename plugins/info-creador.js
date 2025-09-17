// créditos github.com/BrayanOFC no quitar creditos
async function handler(m, { conn }) {
  try {
    await m.react('👨🏻‍💻');

    // Primer creador
    const name1 = 'Xzzys26';
    const empresa1 = 'Xzzys26 (erenxito) - Servicios Privado Y Premium ⚡️';
    const numero1 = 'Wa.me+18097769423';
    const dash1 = 'https://dash.deluxehost.cl';
    const github1 = 'https://github.com/xzzys26';
    const imagen1 = 'https://files.catbox.moe/g3nbig.jpg';

    // Segundo creador
    const name2 = '👑 The-Carlos';
    const empresa2 = '⚡ Servicios Tecnológicos ⚡';
    const numero2 = '+52 55 4487 6071';
    const github2 = 'https://github.com/Thecarlos19';

    const caption = `
╭━━━〔 👑 *CREADOR INFO* 👑 〕━━━⬣
┃ ⚡︎ 🙎🏻‍♂️ *Nombre:* ${name1}
┃ ⚡︎ 🏢 *Empresa:* ${empresa1}
┃ ⚡︎ 📱 *Número:* ${numero1}
┃ ⚡︎ 🖇 *Dash Deluxe Host:* ${dash1}
┃ ⚡︎ 💻 *GitHub:* ${github1}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 👑 *CO-CREADOR* 👑 〕━━━⬣
┃ ⚡︎ 🌟 *Nombre:* ${name2}
┃ ⚡︎ 🏢 *Empresa:* ${empresa2}
┃ ⚡︎ 📱 *Número:* ${numero2}
┃ ⚡︎ 💻 *GitHub:* ${github2}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`.trim()

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: 'Gaara-Ultra-MD ⚡️',
          body: 'Servicios Privado Con Alta Calidad by Xzzys26',
          thumbnailUrl: imagen1,
          sourceUrl: dash1,
          mediaType: 1,
          renderLargerThumbnail: true
        },
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363422694102494@newsletter',
          newsletterName: 'Gaara-Ultra-MD - Update ⚡️',
          serverMessageId: 777
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.reply('❌ Ocurrió un error al mostrar la info del creador.');
  }
}

handler.help = ['creador'];
handler.tags = ['info'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;