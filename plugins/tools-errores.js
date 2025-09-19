// BrayanOFC >> https://github.com/BrayanOFC

import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('📊'); 
        conn.sendPresenceUpdate('composing', m.chat);

        const pluginsDir = './plugins';

        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

        let response = `🛠️ *ʀᴇᴠɪsɴᴀᴅᴏ ᴇʀʀᴏʀᴇs sɪɴᴛᴀxʏs:*\n\n`;
        let hasErrors = false;

        for (const file of files) {
            try {
                await import(path.resolve(pluginsDir, file));
            } catch (error) {
                hasErrors = true;
                response += `⚡ *Error en:* ${file}\n${error.message}\n\n`;
            }
        }

        if (!hasErrors) {
            response += '✅ 𝙏𝙊𝘿𝙊 𝙀𝙎𝙏𝘼 𝙀𝙉 𝙊𝙍𝘿𝙀𝙉 𝙉𝙊 𝙃𝘼𝙔 𝙀𝙍𝙍𝙊𝙍𝙀𝙎';
        }

        await conn.reply(m.chat, response, m);
        await m.react('🛠️');
    } catch (err) {
        await m.react('✖️'); 
        console.error(err);
        conn.reply(m.chat, '❌ *Ocurrió un fallo al verificar los plugins.*', m);
    }
};

handler.command = ['errores'];
handler.help = ['errores'];
handler.tags = ['owner'];

export default handler;