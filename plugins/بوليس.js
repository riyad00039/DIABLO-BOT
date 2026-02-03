import fetch from 'node-fetch'; // إذا لم تكن موجودة بالفعل

const handler = async (m, { conn }) => {
  try {
    // تحديد الشخص المستهدف: إما من الرد، أو المنشن، أو المرسل نفسه
    const who = m.quoted
      ? m.quoted.sender
      : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;

    // جلب صورة البروفايل، أو صورة افتراضية عند الفشل
    let avatar;
    try {
      avatar = await conn.profilePictureUrl(who, 'image');
    } catch (e) {
      avatar = 'https://telegra.ph/file/d1e32c48ec245ba4e8943.jpg';
    }

    // رابط API لإنشاء الصورة
    const apiUrl = `https://some-random-api.com/canvas/lolice?avatar=${encodeURIComponent(avatar)}`;

    // إرسال الصورة
    await conn.sendMessage(m.chat, {
      image: { url: apiUrl },
      caption: '*🚔 الآن أنت محقق!*',
    }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('❌ حدث خطأ أثناء تنفيذ الأمر.');
  }
};

handler.help = ['lolice'];
handler.tags = ['maker'];
handler.command = /^(بوليس)$/i;

export default handler;