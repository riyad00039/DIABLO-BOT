// 🎬 تشغيل فيديو من YouTube ⎆
// ᖇYᘔO ᗷOT 🧰

import axios from 'axios'
import crypto from 'crypto'
import yts from 'yt-search'

const handler = async (m, { conn, args, command }) => {
  if (args.length < 1) 
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ اكـتـب اسـم الـفـيـديـو 🎬 ↞*\n*⎆┇ مــثــال :*\n*.فيديو الـبـخـت - ويـجـز*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  let query = args.join(' ');
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  let username = conn.getName(who);

  let fkon = { 
    key: { 
      fromMe: false, 
      participant: `0@c.us`, 
      ...(m.chat ? { remoteJid: `status@broadcast` } : {}) 
    }, 
    message: { 
      contactMessage: { 
        displayName: username, 
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${username},;;;\nFN:${username}\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  };

  try {
    // البحث عن الفيديو
    let searchResults = await yts(query);
    let video = searchResults.videos[0];

    if (!video) 
      return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ ⚠️ لا يـمـكـن الـعـثـور عـلـى الـفـيـديـو ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // تنزيل الفيديو فقط
    let res = await downloadYouTube(video.url, '720');
    if (!res.status) 
      return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ ❌ فشل التحميل ↞*\n*⎆┇ 📝 ${res.error}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

    let { title, download } = res.result;

    // إرسال الفيديو مع المعلومات في نفس الرسالة
    let caption = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ 🎬 العنوان:* ${video.title}
*⎆┇ 👤 القناة:* ${video.author.name}
*⎆┇ ⏰ المدة:* ${video.timestamp}
*⎆┇ 📊 المشاهدات:* ${video.views.toLocaleString()}
*⎆┇ 📅 النشر:* ${video.ago}
*⎆┇ 🔗 الرابط:* ${video.url}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
    `;

    await conn.sendMessage(m.chat, { 
      video: { url: download }, 
      caption: caption
    }, { quoted: fkon });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ ⚠️ حدث خطأ أثناء تحميل الفيديو ↞*\n*⎆┇ 📝 ${e.message}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

// 👇 هنا تمت إضافة كلمة "فيديو" لتعمل كأمر إضافي بجانب "ytmp4"
handler.command = ['ytmp4', 'فيديو'];

export default handler;

// =============================================================

async function downloadYouTube(link, format = '720') {
  const apiBase = "https://media.savetube.me/api";
  const apiCDN = "/random-cdn";
  const apiInfo = "/v2/info";
  const apiDownload = "/download";

  const decryptData = async (enc) => {
    try {
      const key = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    } catch {
      return null;
    }
  };

  const request = async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : apiBase}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://yt.savetube.me',
          'referer': 'https://yt.savetube.me/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  };

  const youtubeID = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (!youtubeID) return { status: false, error: "لم يتم استخراج ID الفيديو من الرابط." };

  try {
    const cdnRes = await request(apiCDN, {}, 'get');
    if (!cdnRes.status) return cdnRes;
    const cdn = cdnRes.data.cdn;

    const infoRes = await request(`https://${cdn}${apiInfo}`, { url: `https://www.youtube.com/watch?v=${youtubeID[1]}` });
    if (!infoRes.status) return infoRes;
    
    const decrypted = await decryptData(infoRes.data.data);
    if (!decrypted) return { status: false, error: "فشل في فك تشفير بيانات الفيديو." };

    const downloadRes = await request(`https://${cdn}${apiDownload}`, {
      id: youtubeID[1],
      downloadType: 'video',
      quality: format,
      key: decrypted.key
    });

    return {
      status: true,
      result: {
        title: decrypted.title || "فيديو غير معروف",
        download: downloadRes.data.data.downloadUrl
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
}