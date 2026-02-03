const handler = async (m, { conn, isOwner }) => {
  // 🔎 جلب جميع المستخدمين الذين لديهم إنذارات
  const adv = Object.entries(global.db.data.users).filter(([_, data]) => data.warn && data.warn > 0);

  // 💬 التنسيق مع الزخرفة الخاصة بك
  const caption = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇📋 قـائـمـة الإنـذارات ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

${adv.length > 0 
  ? adv.map(([jid, user], i) => `
*⎆┇👤 ${i + 1}.* @${jid.split('@')[0]} ↞
*⎆┇⚠️ إنـذاراتـه:* ❪${user.warn}/3❫ ↞
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`).join('\n')
  : '*⎆┇🎉 لا يوجد أي مستخدم لديه إنذارات حالياً ↞*'}
`;

  // 💢 تفاعل الإيموجي
  await conn.sendMessage(m.chat, { react: { text: '🚨', key: m.key } });

  // 📤 إرسال القائمة
  await conn.sendMessage(
    m.chat,
    { text: caption, mentions: await conn.parseMention(caption) },
    { quoted: m }
  );
};

handler.command = /^(listwarn|انذارات|التحذيرات)$/i;
handler.group = true;
handler.admin = true;

export default handler;