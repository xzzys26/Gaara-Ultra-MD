const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };

  const miniopcion = `╭━━━〔 *⚡️ OPCIONES PARA GRUPOS* 〕━━━╮
┃ ${usedPrefix + command} welcome
┃ ${usedPrefix + command} autoresponder
┃ ${usedPrefix + command} autoaceptar
┃ ${usedPrefix + command} autorechazar
┃ ${usedPrefix + command} detect
┃ ${usedPrefix + command} antidelete
┃ ${usedPrefix + command} antilink
┃ ${usedPrefix + command} antilink2
┃ ${usedPrefix + command} nsfw
┃ ${usedPrefix + command} autolevelup
┃ ${usedPrefix + command} autosticker
┃ ${usedPrefix + command} reaction
┃ ${usedPrefix + command} antitoxic
┃ ${usedPrefix + command} audios
┃ ${usedPrefix + command} modoadmin
┃ ${usedPrefix + command} antifake
┃ ${usedPrefix + command} antibot
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 *🚀 OPCIONES PARA MI CREADOR* 〕━━━╮
┃ ${usedPrefix + command} antisubots
┃ ${usedPrefix + command} public
┃ ${usedPrefix + command} status
┃ ${usedPrefix + command} serbot
┃ ${usedPrefix + command} restrict
┃ ${usedPrefix + command} autoread
┃ ${usedPrefix + command} antispam
┃ ${usedPrefix + command} antiprivado
╰━━━━━━━━━━━━━━━━━━━━━━╯`;


  const isEnable = /true|enable|(turn)?on|1/i.test(command);
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const type = (args[0] || '').toLowerCase();
  let isAll = false;

  const validateGroupAdmin = () => {
    if (!m.isGroup) {
      if (!isOwner) {
        global.dfail('group', m, conn);
        throw false;
      }
    } else if (!isAdmin && !isOwner) {
      global.dfail('admin', m, conn);
      throw false;
    }
  };

  const validateOwner = () => {
    if (!isOwner) {
      global.dfail('owner', m, conn);
      throw false;
    }
  };

  const validateROwner = () => {
    if (!isROwner) {
      global.dfail('rowner', m, conn);
      throw false;
    }
  };

  switch (type) {
    case 'welcome': case 'bienvenida':
      validateGroupAdmin();
      chat.welcome = isEnable;
      break;

    case 'autoaceptar': case 'aceptarnuevos':
      validateGroupAdmin();
      chat.autoAceptar = isEnable;
      break;

    case 'autorechazar': case 'rechazarnuevos':
      validateGroupAdmin();
      chat.autoRechazar = isEnable;
      break;

    case 'detect': case 'avisos':
      validateGroupAdmin();
      chat.detect = isEnable;
      break;

    case 'antibot':
      validateGroupAdmin();
      chat.antiBot = isEnable;
      break;

    case 'antisubots': case 'antisub': case 'antisubot': case 'antibot2':
      validateGroupAdmin();
      chat.antiBot2 = isEnable;
      break;

    case 'antidelete': case 'antieliminar': case 'delete':
      validateGroupAdmin();
      chat.delete = isEnable;
      break;

    case 'public': case 'publico':
      isAll = true;
      validateROwner();
      global.opts['self'] = !isEnable;
      break;

    case 'antilink': case 'antienlace':
      validateGroupAdmin();
      chat.antiLink = isEnable;
      break;

    case 'antilink2': case 'antienlace2':
      validateGroupAdmin();
      chat.antiLink2 = isEnable;
      break;

    case 'status': case 'autobiografia': case 'bio': case 'biografia':
      isAll = true;
      validateROwner();
      bot.autobio = isEnable;
      break;

    case 'frases': case 'autofrases':
      isAll = true;
      validateROwner();
      bot.frases = isEnable;
      break;

    case 'autoresponder': case 'autorespond':
      validateGroupAdmin();
      chat.autoresponder = isEnable;
      break;

    case 'nsfw': case 'nsfwhot': case 'nsfwhorny':
      validateGroupAdmin();
      chat.nsfw = isEnable;
      break;

    case 'autolevelup': case 'autonivel': case 'nivelautomatico':
      validateGroupAdmin();
      chat.autolevelup = isEnable;
      break;

    case 'autosticker':
      validateGroupAdmin();
      chat.autosticker = isEnable;
      break;

    case 'reaction': case 'reaccion': case 'emojis': case 'antiemojis': case 'reacciones': case 'reaciones':
      validateGroupAdmin();
      chat.reaction = isEnable;
      break;

    case 'antitoxic': case 'antitoxicos': case 'antimalos':
      validateGroupAdmin();
      chat.antitoxic = isEnable;
      break;

    case 'audios':
      validateGroupAdmin();
      chat.audios = isEnable;
      break;

    case 'modoadmin': case 'soloadmin': case 'modeadmin':
      validateGroupAdmin();
      chat.modoadmin = isEnable;
      break;

    case 'antifake': case 'antifalsos': case 'antiextranjeros': case 'antiinternacional':
      validateGroupAdmin();
      chat.antifake = isEnable;
      break;

    case 'serbot': case 'jadibot': case 'modoserbot':
      isAll = true;
      validateROwner();
      bot.jadibotmd = isEnable;
      break;

    case 'restrict': case 'restringir':
      isAll = true;
      validateOwner();
      bot.restrict = isEnable;
      break;

    case 'autoread': case 'autovisto':
      isAll = true;
      validateROwner();
      bot.autoread2 = isEnable;
      global.opts['autoread'] = isEnable;
      break;

    case 'antiprivado': case 'antiprivate': case 'privado':
      isAll = true;
      validateROwner();
      bot.antiPrivate = isEnable;
      break;

    case 'anticall': case 'antillamar':
      isAll = true;
      validateROwner();
      bot.antiCall = isEnable;
      break;

    case 'antispam':
      isAll = true;
      validateOwner();
      bot.antiSpam = isEnable;
      break;

    case 'antispam2':
      isAll = true;
      validateOwner();
      bot.antiSpam2 = isEnable;
      break;

    case 'pconly': case 'privateonly': case 'soloprivados':
      isAll = true;
      validateROwner();
      global.opts['pconly'] = isEnable;
      break;

    case 'gconly': case 'grouponly': case 'sologrupos':
      isAll = true;
      validateROwner();
      global.opts['gconly'] = isEnable;
      break;

    case 'swonly': case 'statusonly':
      isAll = true;
      validateROwner();
      global.opts['swonly'] = isEnable;
      break;

    case 'antitrabas': case 'antitraba': case 'antilag':
      validateGroupAdmin();
      chat.antiTraba = isEnable;
      break;

    case 'simi': case 'chatbot':
      validateGroupAdmin();
      chat.simi = isEnable;
      break;

    default:
      if (!/[01]/.test(command)) {
        return conn.reply(m.chat, miniopcion, m, fkontak);
      }
      throw false;
  }

  return conn.reply(
    m.chat,
    `🛩 *La función "${type}" ha sido ${isEnable ? 'activada' : 'desactivada'} ${isAll ? 'en todo el bot' : 'en este chat'}.*`,
    m,
    fkontak
  );
};

handler.help = ['enable', 'disable'].map(cmd => `${cmd} <opción>`);
handler.tags = ['owner', 'group'];
handler.command = ['enable', 'disable', 'on', 'off'];

export default handler;