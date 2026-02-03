const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;

  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
      ? m.quoted.sender 
      : text;
  } else {
    who = m.chat;
  }

  if (!who) {
    const warntext = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ قم بالرد على رسالة أو منشن المستخدم ↞*
*⎆┇📌 مثـال: ${usedPrefix + command} @${global.suittag} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`.trim();
    throw m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  // 🔎 التحقق من وجود المستخدم في قاعدة البيانات
  let user = global.db.data.users[who];
  if (!user) {
    global.db.data.users[who] = { warn: 0 };
    user = global.db.data.users[who];
  }

  const dReason = 'بدون سبب';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  user.warn = (user.warn || 0) + 1;

  // ⚠️ إرسال التحذير
  await m.reply(
    `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ تـحـذيـر جـديـد ↞*
*⎆┇👤 الـمـسـتـخـدم: @${who.split`@`[0]} ↞*
*⎆┇📖 الـسـبـب: ${sdms} ↞*
*⎆┇🧮 الـعـدد: ❪${user.warn}/3❫ ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
    null,
    { mentions: [who] }
  );

  // 🚨 إذا وصل المستخدم إلى 3 تحذيرات
  if (user.warn >= 3) {
    user.warn = 0;
    await m.reply(
      `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚫 تـحـذـيـر نـهـائـي ↞*
*⎆┇👤 @${who.split`@`[0]} ↞*
*⎆┇📛 تـجـاوزت 3 تـحـذيـرات ↞*
*⎆┇🧹 سـيـتـم طـردك الآن 👽 ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
      null,
      { mentions: [who] }
    );

    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return !1;
};

handler.command = /^(تحذير|warn|انذار)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;