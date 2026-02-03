// plugins/fun/divorce.js
// أمر: طلاق (يحذف سجل الزواج) — يمكن للعريس أو العروسة أو صاحب البوت/المالك تنفيذ الطلاق

const handler = async (m, { conn, text }) => {
  try {
    if (!global.db) global.db = { data: { marriages: {} }, write: async () => {} }
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.marriages) global.db.data.marriages = {}

    const marriages = global.db.data.marriages

    // نعرّف من هو التنفيذي: إما من mention أو النص أو نفس المرسل
    // حالات استخدام:
    // 1) المستخدم يكتب "طلاق" ليتطلق هو/هي (إذا هو/هي متزوج/ة)
    // 2) المستخدم يكتب "طلاق @user" لطلب طلاق user (لو هو/هي طرف في الزواج)
    // 3) صاحب البوت (owner/ROwner) يقدر يطلب طلاق لأي سجل
    let targetJid = null
    if (m.mentionedJid && m.mentionedJid.length) {
      targetJid = m.mentionedJid[0]
    } else if (text && text.trim()) {
      let candidate = text.trim().split(/\s+/)[0]
      candidate = candidate.replace(/^\+/, "").replace(/\D/g, "")
      if (candidate.length >= 8) targetJid = candidate + "@s.whatsapp.net"
    }

    // ابحث عن سجل مرتبط بالمرسل أو بالـ targetJid
    let foundEntryKey = null
    let foundEntry = null

    if (targetJid) {
      foundEntryKey = Object.keys(marriages).find(k => marriages[k].groom === targetJid || marriages[k].bride === targetJid)
    } else {
      // افتراضي: نبحث عن سجل للمرسل
      foundEntryKey = Object.keys(marriages).find(k => marriages[k].groom === m.sender || marriages[k].bride === m.sender)
    }

    if (!foundEntryKey) {
      return conn.sendMessage(m.chat, { text: "ℹ️ لم أجد سجل زواج مرتبط بالطرف المطلوب." }, { quoted: m })
    }

    foundEntry = marriages[foundEntryKey]

    // تحقق من صلاحيات الطلاق: المرسل (m.sender) يجب أن يكون أحد الطرفين أو مالك البوت
    const isOwner = global.owner ? (global.owner.includes && global.owner.includes(m.sender)) : (m.sender === global.conn?.user?.id)
    const isROwner = global.db?.data?.users?.[m.sender]?.role === 'ro' // تخميني، إن وُجد دور
    const allowed = (m.sender === foundEntry.groom) || (m.sender === foundEntry.bride) || isOwner || isROwner

    if (!allowed) {
      return conn.sendMessage(m.chat, { text: "🚫 ليس لديك تصريح لطلاق هذا الزواج. الطلاق مسموح فقط للعريس، العروسة، أو صاحب البوت." }, { quoted: m })
    }

    // احذف السجل
    delete marriages[foundEntryKey]
    try { if (global.db.write) await global.db.write() } catch (e) { console.error('db.write failed', e) }

    // إخطار في الشات
    const groomTag = "@" + foundEntry.groom.split("@")[0]
    const brideTag = "@" + foundEntry.bride.split("@")[0]

    await conn.sendMessage(m.chat, { text: `💔 تم تسجيل الطلاق بين ${groomTag} و ${brideTag}.\nتم الحذف من السجلات.` }, { mentions: [foundEntry.groom, foundEntry.bride] })

  } catch (err) {
    console.error('Error in divorce handler:', err)
    await conn.sendMessage(m.chat, { text: "حصل خطأ أثناء تنفيذ أمر الطلاق." }, { quoted: m })
  }
}

handler.command = /^(طلاق|divorce)$/i
handler.group = true
export default handler