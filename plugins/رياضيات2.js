let handler = m => m

handler.before = async function (m) {
  // تأكد أن الرسالة نصية
  if (!m.text) return !0

  // قبول أرقام عربية وإنجليزية مع فواصل ومسافات
  const cleanText = m.text.trim().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)) // تحويل الأرقام العربية لإنجليزية
  if (!/^(-?\d+(\.\d+)?|\d+)$/.test(cleanText)) return !0

  const id = m.chat
  // تأكد أن الرد على رسالة من البوت فيها "احسب"
  if (!m.quoted || !m.quoted.fromMe) return !0
  const quotedText = (m.quoted?.text || '').toLowerCase()
  if (!quotedText.includes('احسب')) return !0

  this.math = this.math || {}
  if (!(id in this.math)) {
    return this.reply(m.chat, '⚠️ لا توجد مسابقة رياضيات نشطة في هذه الدردشة.', m)
  }

  // التحقق من أن الرد مرتبط بنفس السؤال
  const current = this.math[id]
  if (!current || !current[0] || m.quoted.id !== current[0].id) return !0

  let math = JSON.parse(JSON.stringify(current[1]))

  // مقارنة الإجابة
  const isCorrect = Number(cleanText) === Number(math.result)

  if (isCorrect) {
    global.db.data.users[m.sender].exp += math.bonus
    clearTimeout(current[3])
    delete this.math[id]
    return m.reply(`✅ *إجابة صحيحة!*\n\n🎉 حصلت على *+${math.bonus} XP*`)
  } else {
    if (--current[2] <= 0) {
      clearTimeout(current[3])
      delete this.math[id]
      return m.reply(`❌ *لقد انتهت المحاولات!*\nالإجابة الصحيحة هي: *${math.result}*`)
    } else {
      return m.reply(`❎ *إجابة خاطئة!*\nتبقّى لك *${current[2]}* محاولة.`)
    }
  }
}

export default handler