let handler = async (m, { conn }) => {
  let texto = `
👑 *Dashboard Oficial*

Aquí puedes administrar tu bot desde el panel web:

🌐 *Dash:* https://dash.deluxehost.cl
`;

  await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

handler.command = /^dash|dashboard$/i;
handler.tags = ['info'];
handler.help = ['dash'];

export default handler;