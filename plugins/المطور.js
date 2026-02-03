import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.react('🇪🇬');

        let username = await conn.getName(m.sender);

        // إرسال مقطع صوتي ترحيبي
        await conn.sendMessage(
            m.chat,
            { audio: { url: 'https://files.catbox.moe/ysx10k.mp3' }, mimetype: 'audio/mp4', ptt: false },
            { quoted: m }
        );

        // الانتظار 2 ثانية
        await new Promise(resolve => setTimeout(resolve, 2000));

        // إرسال بطاقة الاتصال (VCARD) مع الصورة عند إرسال الرقم فقط
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:『𝙁 𝙚 𝙡 𝙞 𝙭』
TEL;type=CELL;waid=201113538278:+201113538278
EMAIL;type=INTERNET:riyadmosa5@gmail.com
ADR:;;Egypt;;;;
END:VCARD`;

        await conn.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: "『𝙁 𝙚 𝙡 𝙞 𝙭』",
                    contacts: [{ vcard }]
                },
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        title: '『𝙁 𝙚 𝙡 𝙞 𝙭』',
                        body: 'المطور الرسمي للبوت',
                        thumbnailUrl: 'https://files.catbox.moe/ltxxon.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: m }
        );

        // الرسالة الأخيرة بدون صورة وبخط عريض
        const txt = `
*مرحباً ${username}*
*هذا هو مطور البوت الأسطوري*
*𝙁 𝙚 𝙡 𝙞 𝙭*
*لا تزعجه إلا للضرورة*

*قوانين الاستخدام:*
*1. ادخل بتحية السلام*
*2. لا تزعجه بطلبات فارغة*
*3. السكربت ليس مجاني*

*هذا الرقم ليس بوت، بل المطور الرسمي*
`;

        await conn.sendMessage(
            m.chat,
            { text: txt },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '⚠️ حدث خطأ أثناء تنفيذ الأمر.', m);
    }
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|المطور|مطور|felix)$/i;

export default handler;