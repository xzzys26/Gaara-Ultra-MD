const handler = async (m, { conn }) => {
    try {
        const emojis = '🚫'; 
        const done = '✅'; 

        let user;
        const db = global.db.data.users || (global.db.data.users = {});

        // Obtener JID del usuario a desbanear
        if (m.quoted) {
            user = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length) {
            user = m.mentionedJid[0];
        } else {
            await conn.reply(m.chat, `*${emojis} Etiqueta o responde al usuario que deseas desbanear.*`, m);
            return;
        }

        if (db[user]) {
            db[user].banned = false;
            db[user].banReason = '';
            db[user].bannedBy = null;

            const nametag = await conn.getName(user);
            await conn.reply(m.chat, `*${done} El usuario* *@${user.split('@')[0]}* *ha sido desbaneado.*`, m, {
                mentions: [user]
            });

        } else {
            await conn.reply(m.chat, `*⚠️ El usuario no está registrado.*`, m);
        }
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `✖️ *Error en unbanuser:* ${e.message}`, m);
    }
};

handler.help = ['unbanuser'];
handler.command = ['unbanuser'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;