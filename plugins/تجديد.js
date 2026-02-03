import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) 
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ هذا الأمر للمشرفين فقط ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m);

  try {
    const groupId = m.chat;

    // تجديد رابط الدعوة
    const newInviteCode = await conn.groupRevokeInvite(groupId);
    const newLink = `https://chat.whatsapp.com/${newInviteCode}`;

    // محاولة الحصول على صورة الجروب
    let groupImage;
    try {
      groupImage = await conn.profilePictureUrl(groupId, 'image'); 
    } catch (e) {
      groupImage = 'https://telegra.ph/file/b9c7242b2ea534c9fea51.jpg'; // صورة افتراضية
    }

    // تجهيز الصورة
    const media = await prepareWAMessageMedia(
      { image: { url: groupImage } },
      { upload: conn.waUploadToServer }
    );

    // النص المزخرف
    const teks = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🔗 تم تجديد رابط الدعوة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

⎆┇🌐 الرابط الجديد: ${newLink} ↞

*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇✦ ᖇYᘔO ᗷOT دائما بالخدمة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`;

    // إنشاء الرسالة التفاعلية مع زر نسخ الرابط
    const msg = generateWAMessageFromContent(groupId, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: teks },
            header: media,
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: 'نسخ الرابط ',
                    copy_code: newLink
                  })
                }
              ]
            }
          })
        }
      }
    }, {});

    await conn.relayMessage(groupId, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ حدث خطأ أثناء تجديد الرابط ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m);
  }
};

handler.help = ['تجديد_لينك'];
handler.tags = ['group'];
handler.command = ['تجديد_لينك', 'تجديد'];
handler.group = true;
handler.admin = true;

export default handler;