import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // تفاعل مؤقت أثناء التحميل
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // جلب صورة Waifu من API
    const res = await fetch('https://api.waifu.pics/sfw/waifu');
    if (!res.ok) throw new Error('خطأ في الاتصال بخدمة Waifu Pics');

    const json = await res.json();
    if (!json.url) throw new Error('لم يتم العثور على صورة');

    // إرسال الصورة مباشرة مع تعليق واسم البوت
    await conn.sendMessage(
      m.chat,
      {
        image: { url: json.url },
        caption: `*شايفك يالي عاوز تتجوزها 🗿💔*\n\n✨ ᖇYᘔO ᗷOT`,
      },
      { quoted: m }
    );

    // تفاعل نجاح
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: `⚠️ حدث خطأ: ${err.message}` }, { quoted: m });
  }
};

handler.help = ['waifu'];
handler.tags = ['anime'];
handler.command = /^(بنت|waifu)$/i;
handler.limit = true;

export default handler;