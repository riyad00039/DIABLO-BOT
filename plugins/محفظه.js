let handler = async (m, { conn, usedPrefix }) => {
  let who = m.quoted ? m.quoted.sender :
            (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] :
            m.fromMe ? conn.user.jid : m.sender)

  let user = global.db.data.users[who]

  if (!user) throw `🟨 المستخدم غير موجود في قاعدة بياناتي`

  let username = conn.getName(who)

  // إذا لم يكن المستخدم موجودًا في قاعدة البيانات
  if (!(who in global.db.data.users)) {
    return conn.reply(m.chat, `🟨 المستخدم غير موجود في قاعدة بياناتي`, m)
  }

  conn.reply(m.chat, `
> ˼💰˹ مــــحــــفــــظــــة╿↶💰 ‣ | *${username}*
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*┇▢〉💵‣ الدولارات: ${user.exp}*
*┇▢〉🎖️‣ لفل تبعك: ${user.level}*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
> إستخدم امر [ .بنك ] للإستطلاع على البنك الخاص بك!.
`, m, { mentions: [who] })
}

handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['محفظة'] 

export default handler