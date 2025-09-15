var handler = async (m, { conn, text, args, command }) => {
    try {
        const emojis = '🚫'; 
        const senderJid = conn.user.jid;
        const bantMsg = `${emojis} *Etiqueta o responde al usuario que deseas banear.*`;

        // Obtener JID del objetivo
        let user;
        if (m.quoted) {
            user = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length) {
            user = m.mentionedJid[0];
        } else {
            return conn.reply(m.chat, bantMsg, m, { mentions: [senderJid] });
        }

        const number = user.split('@')[0];
        const reason = args.slice(1).join(' ') || 'Sin motivo especificado';

        // Validaciones
        if (user === conn.user.jid)
            return conn.reply(m.chat, `*⚠️ No puedo banearme a mí mismo.*`, m);

        for (const ownerNumber of global.owner) {
            if (number === ownerNumber) {
                return conn.reply(m.chat, `⚠️ *No puedo banear al propietario* *@${ownerNumber}*.`, m, {
                    mentions: [`${ownerNumber}@s.whatsapp.net`]
                });
            }
        }

        const users = global.db.data.users || (global.db.data.users = {});
        if (!users[user]) users[user] = {};
        if (users[user].banned) {
            return conn.reply(m.chat, `☁️ *El usuario @${number} ya está baneado.*`, m, { mentions: [user] });
        }

        users[user].banned = true;
        users[user].banReason = reason;
        users[user].bannedBy = m.sender;

        await conn.reply(m.chat, `✅ *Usuario @${number} baneado con éxito.*\n📌 *Motivo:* ${reason}`, m, {
            mentions: [user]
        });

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `✖️ *Ocurrió un error:* ${e.message}`, m);
    }
};

handler.help = ['banuser'];
handler.command = ['banuser'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;