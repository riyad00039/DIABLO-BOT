import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    const device = await getDevice(m.key.id);
    const mentionId = m.key.participant || m.key.remoteJid;

    let group = m.chat;
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);

    // محاولة الحصول على صورة الروم
    let groupMetadata = await conn.groupMetadata(group);
    let groupImage;

    try {
        groupImage = await conn.profilePictureUrl(m.chat, 'image'); 
    } catch (e) {
        groupImage = null;
    }

    // صورة افتراضية لو مفيش بروفايل
    let imageUrl = groupImage ? groupImage : 'https://telegra.ph/file/b9c7242b2ea534c9fea51.jpg';

    // تجهيز الصورة
    var imageMedia = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer });

    if (device !== 'desktop' && device !== 'web') {
        // الرسالة التفاعلية المزخرفة
        const interactiveMessage = {
            body: { 
                text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇📌 رابط الدعوة للجروب ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
                `.trim() 
            },
            footer: { text: `✦ ᖇYᘔO ᗷOT ✦` },
            header: {
                title: `*✦ مرحباً يا: @${mentionId.split('@')[0]} ✦*`,
                subtitle: `✦ يمكنك نسخ رابط الدعوة مباشرة من الزر بالأسفل 👇 ✦`,
                hasMediaAttachment: true,
                imageMessage: imageMedia.imageMessage, 
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: ' نسـخ الـرابـط ',
                            copy_code: link
                        })
                    }
                ],
                messageParamsJson: ''
            }
        };

        // إنشاء الرسالة
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: { interactiveMessage },
            },
        }, { userJid: conn.user.jid, quoted: m });

        // إضافة المنشن
        msg.message.viewOnceMessage.message.interactiveMessage.contextInfo = { mentionedJid: [mentionId] };
        
        // إرسال
        conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } else {
        // في حال كان الجهاز desktop أو web
        await conn.sendFile(
            m.chat,
            imageUrl,
            'group.jpg',
            `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇🔗 رابط الجروب ↞*\n*⎆┇⎆ اضغط للنسخ: ${link} ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
            m
        );
    }
};

handler.help = ['لينك'];
handler.tags = ['group'];
handler.command = ['لينك', 'link'];

export default handler;