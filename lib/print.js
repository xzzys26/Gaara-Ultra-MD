// Pretty console logger for incoming messages (adapted for Baileys v6 raw messages)
import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import PhoneNumber from 'awesome-phonenumber';
import { watchFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import config from '../config.js';

// dynamic imports guarded
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

async function getTerminalImage() {
  try {
    // terminal-image is ESM; default export
    const mod = await import('terminal-image');
    return mod.default;
  } catch {
    return null;
  }
}

// Safe get name without assuming sock.getName exists
async function safeGetName(conn, jid) {
  if (!jid) return '';
  try {
    if (conn?.getName && typeof conn.getName === 'function') {
      return await conn.getName(jid);
    }
    if (conn?.contacts && typeof conn.contacts === 'object') {
      const c = conn.contacts[jid];
      if (c) return c.name || c.notify || c.vname || c.short || c.verifiedName || '';
    }
    if (jid.endsWith('@g.us') && typeof conn?.groupMetadata === 'function') {
      try {
        const md = await conn.groupMetadata(jid);
        if (md?.subject) return md.subject;
      } catch {}
    }
    return jid.split('@')[0];
  } catch {
    return jid.split('@')[0];
  }
}

// Build a lightweight normalized shape from raw Baileys message
function normalizeMessage(raw) {
  const mtype = raw?.message ? Object.keys(raw.message)[0] : 'unknown';
  const content = raw?.message?.[mtype] || {};
  const text = (
    raw?.message?.conversation ||
    content?.text ||
    content?.caption ||
    content?.message ||
    ''
  );
  const mentionedJid = content?.contextInfo?.mentionedJid || [];
  return { mtype, text, mentionedJid };
}

async function downloadBuffer(raw) {
  try {
    if (!raw?.message) return null;
    const mtype = Object.keys(raw.message)[0];
    const msg = raw.message[mtype];
    const isMedia = /imageMessage|videoMessage|stickerMessage|documentMessage|audioMessage/i.test(mtype);
    if (!isMedia) return null;
    const stream = await downloadContentFromMessage(msg, mtype.replace('Message', ''));
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
  } catch {
    return null;
  }
}

export default async function print(raw, conn = { user: {} }) {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES');
    const timeStr = now.toLocaleTimeString('it-IT', { hour12: false }).slice(0, 8);
    const hour = now.getHours();
    const dayIcon = hour < 6 ? '🌙' : hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙';

    // JIDs
    const senderJid = raw?.key?.participant || raw?.key?.remoteJid || '';
    const chatId = raw?.key?.remoteJid || senderJid;

    // Names
    const _name = (await safeGetName(conn, senderJid)) || raw?.pushName || 'Anónimo';
    let senderNum = '';
    if (senderJid) {
      try {
        senderNum = PhoneNumber('+' + senderJid.replace('@s.whatsapp.net', '').replace(':', '')).getNumber('international');
      } catch {
        try { senderNum = senderJid.split('@')[0]; } catch { senderNum = senderJid || 'desconocido'; }
      }
    }
    const sender = (senderNum || senderJid || 'desconocido') + (_name ? ` ~${_name}` : '');
    const chat = await safeGetName(conn, chatId);

    let me = '';
    try {
      if (conn?.user?.jid) {
        me = PhoneNumber('+' + conn.user.jid.replace('@s.whatsapp.net', '')).getNumber('international');
      }
    } catch { me = conn?.user?.jid?.split?.('@')[0] || 'Bot'; }

    const norm = normalizeMessage(raw);
    const grad = gradient(['#ff5f6d', '#ffc371']);
    const stamp = grad(`${dayIcon} ${dateStr} ${timeStr}`);

    // Compute size estimate
    let filesize = 0;
    try {
      const mtype = Object.keys(raw.message || {})[0];
      const msg = raw.message?.[mtype];
      filesize = msg?.fileLength?.low || msg?.fileLength || norm.text?.length || 0;
    } catch {}

    // Build lines
    const lines = [
      `${chalk.cyan('❯')} ${chalk.white.bold('Bot:')} ${chalk.cyan(me + (conn.user?.name ? ` ~${conn.user.name}` : '') )}`,
      `${chalk.cyan('❯')} ${chalk.white.bold('ID:')} ${chalk.yellow(senderJid || 'N/A')}`,
      `${chalk.cyan('❯')} ${chalk.white.bold('Usuario:')} ${chalk.yellow(sender)}`,
      (chatId || '').includes('@s.whatsapp.net')
        ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.greenBright('Privado')} ${chalk.dim(`con ${_name}`)}`
        : (chatId || '').includes('@g.us')
          ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.magentaBright('Grupo')} ${chalk.dim(`${chat}`)}`
          : (chatId || '').includes('@newsletter')
            ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.yellowBright('Canal')} ${chalk.dim(`${chat}`)}`
            : '',
      `${chalk.cyan('❯')} ${chalk.white.bold('Tipo:')} ${chalk.bgBlueBright.bold(await formatMessageTypes(norm.mtype))}`,
      `${chalk.cyan('❯')} ${chalk.white.bold('Tamaño:')} ${chalk.red(filesize + ' B')}`
    ].filter(Boolean);

    const logBuffer = [];
    logBuffer.push(
      boxen(lines.join('\n'), {
        title: stamp,
        titleAlignment: 'center',
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        float: 'center'
      })
    );

    setImmediate(() => {
      console.log(logBuffer.join('\n'));
      logBuffer.length = 0;
    });

    // Optional inline image preview
    try {
      if (global?.opts?.img) {
        const termImg = await getTerminalImage();
        if (termImg && /sticker|image/i.test(norm.mtype)) {
          const buf = await downloadBuffer(raw);
          if (buf) {
            const img = await termImg.buffer(buf);
            if (img) console.log(img.trimEnd());
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Text rendering
    if (typeof norm.text === 'string' && norm.text) {
      let log = norm.text.replace(/\u200e+/g, '');
      log = log.split('\n').map(line => {
        if (line.trim().startsWith('>')) return chalk.bgGray.dim(line.replace(/^>/, '┃'));
        return line;
      }).join('\n');

      if (log.length < 1024) {
        log = log.replace(urlRegex, (url) => chalk.blueBright(url));
      }

      if (Array.isArray(norm.mentionedJid)) {
        for (let jid of norm.mentionedJid.filter(Boolean)) {
          const display = await safeGetName(conn, jid);
          try {
            const bare = jid.split('@')[0];
            log = log.replace('@' + bare, chalk.blueBright('@' + (display || bare)));
          } catch {}
        }
      }

      const isCommand = (() => {
        try {
          const p = config?.prefix || '!';
          return log?.trim()?.startsWith(p);
        } catch { return false; }
      })();

      console.log(isCommand ? chalk.yellow(log) : log);
    }
  } catch (err) {
    console.error('Error en print.js:', err);
  }
}

async function formatMessageTypes(messageStubType) {
  switch (messageStubType) {
    case 'conversation':
      return 'Conversación';
    case 'imageMessage':
      return 'Imagen';
    case 'contactMessage':
      return 'Contacto';
    case 'locationMessage':
      return 'Ubicación';
    case 'extendedTextMessage':
      return 'Texto';
    case 'documentMessage':
      return 'Documento';
    case 'audioMessage':
      return 'Audio';
    case 'videoMessage':
      return 'Video';
    case 'call':
      return 'Llamada';
    case 'chat':
      return 'Chat';
    case 'protocolMessage':
      return 'Cifrado';
    case 'contactsArrayMessage':
      return 'Lista de contactos';
    case 'highlyStructuredMessage':
      return 'Estructurado';
    case 'fastRatchetKeySenderKeyDistributionMessage':
      return 'Distribución de claves';
    case 'sendPaymentMessage':
      return 'Mensaje de pago';
    case 'liveLocationMessage':
      return 'Ubicación en vivo';
    case 'requestPaymentMessage':
      return 'Solicitar pago';
    case 'declinePaymentRequestMessage':
      return 'Rechazar solicitud de pago';
    case 'cancelPaymentRequestMessage':
      return 'Cancelar solicitud de pago';
    case 'templateMessage':
      return 'Mensaje de plantilla';
    case 'stickerMessage':
      return 'Sticker';
    case 'groupInviteMessage':
      return 'Invitación a grupo';
    case 'templateButtonReplyMessage':
      return 'Respuesta de botón de plantilla';
    case 'productMessage':
      return 'Producto';
    case 'deviceSentMessage':
      return 'Mensaje enviado por dispositivo';
    case 'messageContextInfo':
      return 'Contexto del mensaje';
    case 'listMessage':
      return 'Lista';
    case 'viewOnceMessage':
      return 'Mensaje de una sola vez';
    case 'orderMessage':
      return 'Pedido';
    case 'listResponseMessage':
      return 'Respuesta de lista';
    case 'ephemeralMessage':
      return 'Efímero';
    case 'invoiceMessage':
      return 'Factura';
    case 'buttonsMessage':
      return 'Botones';
    case 'buttonsResponseMessage':
      return 'Respuesta de botones';
    case 'paymentInviteMessage':
      return 'Invitación de pago';
    case 'interactiveMessage':
      return 'Interactivo';
    case 'reactionMessage':
      return 'Reacción';
    case 'stickerSyncRmrMessage':
      return 'Sincronización de sticker';
    case 'interactiveResponseMessage':
      return 'Respuesta interactiva';
    case 'pollCreationMessage':
      return 'Creación de encuesta';
    case 'pollUpdateMessage':
      return 'Actualización de encuesta';
    case 'keepInChatMessage':
      return 'Mensaje de mantener en chat';
    case 'documentWithCaptionMessage':
      return 'Documento con leyenda';
    case 'requestPhoneNumberMessage':
      return 'Solicitud de número de teléfono';
    case 'viewOnceMessageV2':
      return 'Mensaje de una sola vez v2';
    case 'encReactionMessage':
      return 'Reacción encriptada';
    case 'editedMessage':
      return 'Mensaje editado';
    case 'viewOnceMessageV2Extension':
      return 'Extensión de mensaje de una vista v2';
    case 'pollCreationMessageV2':
      return 'Creación de encuesta v2';
    case 'scheduledCallCreationMessage':
      return 'Llamada programada';
    case 'groupMentionedMessage':
      return 'Mención en grupo';
    case 'pinInChatMessage':
      return 'Mensaje fijado en chat';
    case 'pollCreationMessageV3':
      return 'Creación de encuesta v3';
    case 'scheduledCallEditMessage':
      return 'Edición de llamada programada';
    case 'ptvMessage':
      return 'Mensaje de PTV';
    case 'botInvokeMessage':
      return 'Invocación de bot';
    case 'callLogMesssage':
      return 'Registro de llamada';
    case 'messageHistoryBundle':
      return 'Paquete de historial de mensajes';
    case 'encCommentMessage':
      return 'Comentario encriptado';
    case 'bcallMessage':
      return 'Mensaje de llamada B';
    case 'lottieStickerMessage':
      return 'Mensaje de sticker Lottie';
    case 'eventMessage':
      return 'Evento';
    case 'commentMessage':
      return 'Comentario';
    case 'newsletterAdminInviteMessage':
      return 'Mensaje de invitación de administrador';
    case 'extendedTextMessageWithParentKey':
      return 'Mensaje de texto con clave principal';
    case 'placeholderMessage':
      return 'Marcador de posición';
    case 'encEventUpdateMessage':
      return 'Actualización de evento encriptado';
    default:
      return messageStubType || 'No especificado';
  }
}

// hot-reload notice (optional)
const __filename = fileURLToPath(import.meta.url);
watchFile(__filename, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"));
});
