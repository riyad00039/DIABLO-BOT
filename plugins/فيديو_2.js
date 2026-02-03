import axios from 'axios';
import crypto from 'crypto';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// ---------------- SAVETUBE ----------------
const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'اغنيه'],

  crypto: {
    hexToBuffer: (hexString) => Buffer.from(hexString, 'hex'),
    decrypt: async (enc) => {
      const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    }
  },

  isUrl: str => { try { new URL(str); return true; } catch { return false; } },
  youtube: url => {
    if (!url) return null;
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let p of patterns) if (p.test(url)) return url.match(p)[1];
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return { status: true, code: 200, data: response.data.cdn };
  },

  download: async (link, format) => {
    if (!link) return { status: false, code: 400, error: "[ ❌ ] أرسل رابط صحيح." };
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "[ ❌ ] الرابط ليس صالح لليوتيوب." };
    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "[ ❌ ] لا يمكن استخراج رابط يوتيوب." };

    const cdnx = await savetube.getCDN();
    if (!cdnx.status) return cdnx;
    const cdn = cdnx.data;

    const result = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
    if (!result.status) return result;
    const decrypted = await savetube.crypto.decrypt(result.data.data);

    const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
      id,
      downloadType: format === 'اغنيه' ? 'audio' : 'video',
      quality: format === 'اغنيه' ? '128' : format,
      key: decrypted.key
    });

    return {
      status: true,
      code: 200,
      result: {
        title: decrypted.title || "بدون عنوان",
        type: format === 'اغنيه' ? 'audio' : 'video',
        format,
        thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        download: dl.data.data.downloadUrl,
        id,
        duration: decrypted.duration,
      }
    };
  }
};

// ---------------- Plugin واحد لكل الصيغ ----------------
let handler = async (m, { conn, text, command }) => {
  const format = command.toLowerCase(); // الصيغة هي اسم الأمر
  const url = text.trim();

  if (!savetube.formats.includes(format)) return;
  if (!url) return await conn.sendMessage(m.chat, { text: `*◞🧠‟⌝╎أرسل رابط لتحميل صيغة ${format}*` }, { quoted: m });

  const response = await savetube.download(url, format);
  if (!response.status) return await conn.sendMessage(m.chat, { text: `❌ خطأ: ${response.error}` }, { quoted: m });

  const mediaUrl = response.result.download;
  const caption = `
*◞🧠‟⌝╎اسـم الـفـيـديـو: ${response.result.title} ⸃⤹*
*⌝💻╎الصـيـغـة:* ${response.result.format} | *المدة:* ${response.result.duration}s
> *╭*  
> *┊ 📌╎رابط التحميل:* ${mediaUrl}  
> *╰*`;

  await conn.sendMessage(m.chat, {
    video: { url: mediaUrl },
    mimetype: response.result.type === 'audio' ? 'audio/mpeg' : 'video/mp4',
    caption
  }, { quoted: m });
};

handler.help = ['<صيغة> <رابط>'];
handler.tags = ['downloader'];
handler.command = /^(144|240|360|480|720|1080|اغنيه)$/i; // كل الصيغ كأوامر جاهزة

export default handler;