import db from '../lib/database.js'

const free = 5000
const prem = 20000

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let time = user.lastclaim + 86400000 // الوقت المتبقي بعد آخر طلب للهدية اليومية

  // التحقق من الوقت المتبقي
  let remainingTime = time - new Date().getTime()
  if (remainingTime > 0) {
    throw `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*  
⎆┇ *أنت جمعت الهدية اليومية بالفعل*  
⎆┇ يمكنك الدخول مرة أخرى بعد *${clockString(remainingTime)}*  
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
  }

  // إضافة الهدية للمستخدم بناءً على نوع الحساب
  user.exp += isPrems ? prem : free
  m.reply(`
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*  
🎁 *هدية يومية*  
▢ *لقد حصلت على:*  
🆙 *XP* : +${isPrems ? prem : free}  
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`)

  // تحديث وقت آخر طلب للمستخدم
  user.lastclaim = new Date().getTime()
}

handler.help = ['daily']
handler.tags = ['econ']
handler.command = ['اسبوعي']

export default handler

// دالة تحويل الوقت المتبقي إلى ساعات ودقائق وثواني
function clockString(ms) {
  if (isNaN(ms) || ms < 0) return "00:00:00"
  
  let hours = Math.floor(ms / (1000 * 60 * 60))
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((ms % (1000 * 60)) / 1000)
  
  hours = hours.toString().padStart(2, '0')
  minutes = minutes.toString().padStart(2, '0')
  seconds = seconds.toString().padStart(2, '0')
  
  return `${hours} ساعات ${minutes} دقائق ${seconds} ثواني`
}