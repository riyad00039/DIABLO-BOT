const handler = async (m, { conn, text, usedPrefix, command }) => {
  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
      ? m.quoted.sender 
      : false;
  } else {
    who = m.chat;
  }

  if (!who) {
    const warntext = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ قم بالرد على رسالة أو منشن المستخدم لإلغاء إنذاره ↞*
*⎆┇📌 مثـال: ${usedPrefix + command} @${global.suittag} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;
    return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  let user = global.db.data.users[who];
  if (!user || !user.warn || user.warn === 0) {
    return m.reply(
      `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ℹ️ المستخدم @${who.split`@`[0]} لا يملك أي تحذيرات حالياً ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
      null,
      { mentions: [who] }
    );
  }

  // تصفير التحذيرات
  user.warn = 0;

  await m.reply(
    `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇✅ تـم إزالـة الإنـذارات ↞*
*⎆┇👤 المستخدم: @${who.split`@`[0]} ↞*
*⎆┇📉 عدد التحذيرات الآن: 0 ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
    null,
    { mentions: [who] }
  );
};

handler.command = /^(الغاء_انذار|حذف_تحذير|resetwarn)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;