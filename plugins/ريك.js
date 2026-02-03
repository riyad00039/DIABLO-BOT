import fetch from 'node-fetch';

const handler = async (m, { conn, args, command }) => {
  const query = args.join(' ');
  if (!query) {
    return m.reply(`🚩 *طريقة الاستخدام لأمر* (${command}):

- *أرسل عنوان فيديو أو رابط من يوتيوب.*
- *سيتم إرسال الصوت كتسجيل صوتي (voice).*

🚩 *مثال:*
${command} faded  
${command} https://youtube.com/watch?v=dQw4w9WgXcQ

ᖇYᘔO ᗷOT 🎤`);
  }

  // إرسال رد فعل "🧞" عند بدء التنفيذ
  await conn.sendMessage(m.chat, { react: { text: '🎤', key: m.key } });

  try {
    const api = `https://api.nekorinn.my.id/downloader/ytplay-savetube?q=${encodeURIComponent(query)}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json?.status || !json?.result) throw '*🚩 فشل في جلب بيانات الفيديو.*';

    const {
      title = 'بدون عنوان',
      channel = 'غير معروف',
      duration = '-',
      imageUrl = '',
      link = ''
    } = json.result.metadata || {};

    const audioUrl = json.result.downloadUrl;
    if (!audioUrl) throw '*⎆ لا يمكن الحصول على الصوت لهذا الفيديو.*';

    const caption = `
🎤 *تسجيل صوتي من يوتيوب*

• 📃 *العنوان:* ${title}
• 📺 *القناة:* ${channel}
• ⏱️ *المدة:* ${duration}
• 🖇️ *الرابط:* ${link}
• 🔍 *النوع:* تسجيل صوتي

ᖇYᘔO ᗷOT ⎆
`.trim();

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: '🚩 Voice from YouTube',
          thumbnailUrl: imageUrl,
          sourceUrl: link,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    const checkAudio = await fetch(audioUrl, { method: 'HEAD' });
    if (!checkAudio.ok) throw '*🚩الملف غير متاح أو الرابط لا يعمل.*';

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true // إرسال كـ voice
    }, { quoted: m });

  } catch (e) {
    console.error('🚩 خطأ:', e);
    throw '*🚩 حدث خطأ أثناء تحميل الصوت.*';
  }
};

handler.help = ['فويس <العنوان أو الرابط>', 'voice <title or url>'];
handler.tags = ['downloader'];
handler.command = ['فويس', 'ريك'];

export default handler;