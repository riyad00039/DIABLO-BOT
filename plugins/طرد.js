let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let developerNumber = '201021902729@s.whatsapp.net'; // رقم المطور بصيغة JID

  // 📢 في حال لم يتم منشن أي شخص
  let kickte = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ مــنشـن الـشـخص أولاً ↞*
*⎆┇📌 مثــال: ${usedPrefix + command} @user ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

  if (!m.mentionedJid[0] && !m.quoted)
    return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  // 🚫 منع طرد المطور
  if (user === developerNumber) {
    return m.reply(
      `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇😏 هـذا هـو مـطـور الـبـوت ↞*
*⎆┇🎭 عايزني أطرده؟ أنت أحول ولا إيه؟ ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
      m.chat,
      { mentions: [developerNumber] }
    );
  }

  // ⚙️ تنفيذ أمر الطرد
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

  m.reply(
    `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚫 تـم طـرد الـعـضـو بـنـجـاح ↞*
*⎆┇👤 الـمـسـؤول: @${m.sender.split('@')[0]} ↞*
*⎆┇🧹 الـشـخـص الـمـطـرود: @${user.split('@')[0]} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
    m.chat,
    { mentions: [m.sender, user] }
  );
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['انطرو', 'طرد'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;