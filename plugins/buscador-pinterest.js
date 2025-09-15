import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid}`);

  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video")) 
      throw new TypeError(`media.type must be "image" or "video", received: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) 
      throw new TypeError(`media.data must be object with url or buffer, received: ${media.data}`);
  }

  if (medias.length < 2) throw new RangeError("Minimum 2 media");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  // Crear el álbum
  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...(options.quoted ? { contextInfo: options.quoted } : {})
      }
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { 
    messageId: album.key.id,
    forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo
  });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );

    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
      ...(options.quoted || {}),
    };

    await conn.relayMessage(img.key.remoteJid, img.message, { 
      messageId: img.key.id,
      forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo
    });

    await baileys.delay(delay);
  }

  return album;
}

const pins = async (judul) => {
  try {
    const res = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=${encodeURIComponent(judul)}`);
    if (Array.isArray(res.data.images)) {
      return res.data.images.map(url => ({
        image_large_url: url,
        image_medium_url: url,
        image_small_url: url
      }));
    }
    return [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: `Ingresa un texto. Ejemplo: .pin gatos` }, { 
    quoted: m,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363403593951965@newsletter',
      newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱*:·',
      serverMessageId: 100
    }
  });

  try {
    const res2 = await fetch('https://files.catbox.moe/875ido.png');
    const thumb2 = Buffer.from(await res2.arrayBuffer());

    // Mensaje que simula el canal arriba
    const fkontak = {
      key: { 
        participants: "0@s.whatsapp.net", 
        remoteJid: "status@broadcast", 
        fromMe: false, 
        id: "Halo" 
      },
      message: {
        locationMessage: {
          name: '𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔 𝗗𝗘 ✦ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁',
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    m.react('🕒');
    const results = await pins(text);
    if (!results || results.length === 0) return conn.sendMessage(m.chat, { text: `No se encontraron resultados para "${text}".` }, { 
      quoted: m,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403593951965@newsletter',
        newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱*:·',
        serverMessageId: 100
      }
    });

    const maxImages = Math.min(results.length, 15);
    const medias = [];

    for (let i = 0; i < maxImages; i++) {
      medias.push({
        type: 'image',
        data: { url: results[i].image_large_url || results[i].image_medium_url || results[i].image_small_url }
      });
    }

    // Enviar álbum con el canal simulado arriba
    await sendAlbumMessage(m.chat, medias, {
      caption: `Resultados de: ${text}\nCantidad de resultados: ${maxImages}`,
      quoted: fkontak,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403593951965@newsletter',
        newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱*:·',
        serverMessageId: 100
      }
    });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: 'Error al obtener imágenes de Pinterest.' }, { 
      quoted: m,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403593951965@newsletter',
        newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱*:·',
        serverMessageId: 100
      }
    });
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];

export default handler;