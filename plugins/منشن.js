import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

let defaultLimit = {};
let usageLimits = {};

const handler = async (m, { isOwner, isAdmin, conn, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let groupId = m.chat;
  let usageKey = `${groupId}:${command}`;

  if (command === 'تحديد_منشن') {
    if (!isOwner) return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇❌ هـذا الأمـر مـتـاح فـقـط لـلمـطـور ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

    let limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) 
      return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇⚠️ رجـاء إدخـال رقـم صـحـيـح كـحـد للاسـتـخـدام ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

    defaultLimit[groupId] = limit;
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇✨ تـم تـعـيـيـن حـد أوامـر الـمـنـشـن إلـى ${limit} مـرة ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }

  if (!defaultLimit[groupId]) defaultLimit[groupId] = 3;
  if (usageLimits[usageKey] === undefined) usageLimits[usageKey] = defaultLimit[groupId];

  if (usageLimits[usageKey] <= 0) {
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇🚫 تـم اسـتـنـفـاذ حـد اسـتـخـدام هـذا الأمـر ↞*\n*⎆┇🧩 تـواصـل مـع الـمـطـور لإعـادة الـتـعـيـيـن ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }

  usageLimits[usageKey]--;

  const coverImageUrl = 'https://files.catbox.moe/zzyfvo.jpg';
  const media = await prepareWAMessageMedia(
    { image: { url: coverImageUrl } },
    { upload: conn.waUploadToServer }
  );

  const textMsg = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚙️ قــائـمـة أوامـر الـمـنـشـن ↞*
*⎆┇🪄 اخـتـر الـنـوع الـمـنـاسـب مـن الأسـفـل ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
> 👥 *مـنـشـن الـكـل*  
> 🌟 *مـنـشـن الأعـضـاء فـقـط*  
> 👑 *مـنـشـن الـمـشـرفـيـن*  
*⎆┇بـواسـطـة⚡ᖇYᘔO ᗷOT⚡↞*
`;

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: textMsg },
          footer: { text: "*✨ إختر من الأزرار بالأسفل ✨*" },
          header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage,
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"👥 مـنـشـن الـكـل","id":".منشن_الكل"}`
              },
              {
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"🌟 مـنـشـن الأعـضـاء","id":".منشن_اعضاء"}`
              },
              {
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"👑 مـنـشـن الـمـشـرفـيـن","id":".منشن_مشرفين"}`
              }
            ]
          },
          contextInfo: { mentionedJid: [m.sender] }
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['منشن', 'تحديد_منشن'];
handler.tags = ['group'];
handler.command = /^(منشن|تحديد_منشن)$/i;
handler.admin = true;
handler.group = true;

export default handler;