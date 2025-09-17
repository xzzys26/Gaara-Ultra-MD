import os from 'os';

let handler = async (m, { conn }) => {
    try {
        const start = Date.now();

        const info = `
*sᴇ ʜᴀ ᴀᴘʟɪᴄᴀᴅᴏ ᴜɴ ʀᴇɪɴɪᴄɪᴏ ᴅᴇʟ ʙᴏᴛ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ....🔄*
        `.trim();

        await conn.reply(m.chat, info, m);

        setTimeout(() => process.exit(0), 3000);

    } catch (error) {
        console.error('[ERROR][REINICIO]', error);
        await conn.reply(m.chat, `❌ Error\n${error.message || error}`, m);
    }
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;