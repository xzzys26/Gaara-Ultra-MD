import { exec } from 'child_process';

let handler = async (m, { conn }) => {
   m.reply('🔄 ᴀᴄᴛᴜᴀʟɪᴢᴀɴᴅᴏ ʙᴏᴛ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ...');

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `⚠️ Error: No se pudo realizar la actualización.\nRazón: ${err.message}`, m);
      return;
    }

    if (stderr) {
      console.warn('Advertencia durante la actualización:', stderr);
    }

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, '⚡ ʏᴀ ᴇsᴛᴏʏ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ', m);
    } else {
      conn.reply(m.chat, `✅ ᴀᴄᴛᴜᴀʟɪᴢᴀᴢɪᴏɴ ᴄᴏɴ ᴇxɪᴛᴏ ᴇᴄʜᴏ\n\n${stdout}`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'up', 'fix'];
handler.rowner = true;

export default handler;