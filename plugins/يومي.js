const free = 2000
const prem = 5000

let handler = async (m, { conn, isPrems }) => {
  try {
    let time = global.db.data.users[m.sender].lastclaim + 86400000
    // التحقق من الوقت المتبقي
    if (new Date() - global.db.data.users[m.sender].lastclaim < 86400000) {
      let remainingTime = msToTime(time - new Date());
      throw `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
⎆┇ *لقد قمت بطلب ذهبك اليومي مؤخرًا.* 
⎆┇ يمكنك الطلب مرة أخرى في *${remainingTime}*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
    }

    // إضافة العملات المناسبة للمستخدم حسب نوع الحساب
    global.db.data.users[m.sender].credit += isPrems ? prem : free
    m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
⎆┇ *🎉 تمت إضافة* ${isPrems ? prem : free} *عملة إلى محفظتك* 
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`)

    // تحديث وقت آخر طلب للمستخدم
    global.db.data.users[m.sender].lastclaim = new Date() * 1
  } catch (err) {
    console.error("Error in daily claim handler:", err);
    m.reply(` ${err}`)
  }
}

handler.help = ['daily']
handler.tags = ['economy']
handler.command = ['يومي'] 

export default handler

// تحويل الوقت المتبقي من ملي ثانية إلى ساعات ودقائق
function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " ساعات " + minutes + " دقائق"
}