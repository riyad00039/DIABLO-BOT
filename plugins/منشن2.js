import moment from 'moment-timezone';
import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

let usageLimits = {};

let handler = async (m, { isOwner, isAdmin, conn, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let groupId = m.chat;
  let usageKey = `${groupId}:${command}`;

  // 📌 تعيين الحد من المطور فقط
  if (command === 'تحديد_منشن') {
    if (!isOwner) {
      return await m.reply(
`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇❌ هذا الأمر متاح فقط للمطور↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
      );
    }

    let limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) {
      return await m.reply(
`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇❌ الرجاء إدخال رقم صحيح كحد للاستخدام↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
      );
    }

    usageLimits[groupId] = limit;
    return await m.reply(
`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇✅ تم تعيين حد المنشن إلى ${limit} مرة↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
    );
  }

  // 📊 التحقق من الحد الحالي
  if (!usageLimits[groupId]) usageLimits[groupId] = 3;
  if (usageLimits[usageKey] === undefined) usageLimits[usageKey] = usageLimits[groupId];

  if (usageLimits[usageKey] <= 0) {
    return await m.reply(
`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ تم استنفاد الحد الأقصى لاستخدام هذا الأمر↞*
*⎆┇📩 تواصل مع المطور لإعادة التعيين↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
    );
  }

  // 👥 فلترة المشاركين حسب نوع المنشن
  let filteredParticipants =
    command === 'منشن_اعضاء'
      ? participants.filter(p => !p.admin)
      : command === 'منشن_مشرفين'
      ? participants.filter(p => p.admin)
      : participants;

  // ⏰ الوقت والتاريخ
  let time = moment.tz('Asia/Riyadh').format('hh:mm A');
  let date = moment.tz('Asia/Riyadh').format('YYYY/MM/DD');

  // 💬 تجهيز النص المنسق
  let teks = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇💬 مـنـشـن جـديـد ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

⎆┇📌 النوع: *${command === 'منشن_اعضاء' ? 'الأعضاء 👥' : command === 'منشن_مشرفين' ? 'المشرفين 👑' : 'الجميع 🌍'}* ↞

*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
${filteredParticipants.map((mem, i) => `*${i + 1}.* @${mem.id.split('@')[0]}`).join('\n')}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

⎆┇🕒 الوقت: ${time}  
⎆┇📅 التاريخ: ${date}  
⎆┇🤖 البوت: ᖇYᘔO ᗷOT ↞
`;

  // 🖼️ الصورة (الإصلاح الحقيقي هنا)
  const imageUrl = 'https://files.catbox.moe/tm8gcw.jpg';
  const media = await prepareWAMessageMedia(
    { image: { url: imageUrl } },
    { upload: conn.waUploadToServer }
  );

  await conn.sendMessage(
    m.chat,
    {
      image: { url: imageUrl }, // ← استخدم الرابط مباشرة (يضمن ظهور الصورة دائمًا)
      caption: teks,
      mentions: filteredParticipants.map(a => a.id)
    },
    { quoted: m }
  );

  usageLimits[usageKey] -= 1;
};

handler.help = ['منشن_اعضاء', 'منشن_مشرفين', 'منشن_الكل', 'تحديد_منشن <عدد>'];
handler.tags = ['group'];
handler.command = /^(منشن_اعضاء|منشن_مشرفين|منشن_الكل|تحديد_منشن)$/i;
handler.admin = true;
handler.group = true;

export default handler;