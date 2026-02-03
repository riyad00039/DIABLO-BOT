let handler = async (m, { conn, command, text, usedPrefix }) => {

  // دالة صغيرة ترجع رقم عشوائي من 0 لحد max
  const rand = (max) => Math.floor(Math.random() * (max + 1))

  // لو ما في نص - نعرض مثال الاستخدام بدل رمي خطأ
  if (!text) {
    let example = `
*[❗ ركـز ❗] اكتب اسم او منشن عشان يشتغل الأمر*

    `.trim()
    return conn.reply(m.chat, example, m)
  }

  // جهز المنشن (لو في) واسم العرض
  let mentioned = m.mentionedJid ? m.mentionedJid : null
  let displayText = text.toUpperCase()
  let randomPercent = rand(500)

  // جواب افتراضي
  let reply = ''

  if (command == 'ورع') {
    reply = `_*${displayText}* *نسبة ورعنته* *${randomPercent}%* *الله يشفيك و تكبر كذا و تكون عاقل*_`
  }

  if (command == 'اهبل') {
    reply = `_*${displayText}* *نسبة هبله* *${randomPercent}%* *اخخ بس متا ناوي تعقل يا ${command.replace('how', '').toUpperCase()}*_`
  }

  if (command == 'غباء') {
    reply = `_*${displayText}* *نسبة غبائه* *${randomPercent}%* *الله يشفيك و تكبر كذا و تكون عاقل*_`
  }

  if (command == 'ذكاء') {
    reply = `_*${displayText}* *نسبة ذكاء* *${randomPercent}%* *الله يقويك و تكبر كذا و تكون اذكى*_`
  }

  if (command == 'خروف') {
    reply = `_*${displayText}* *نسبة خرفنته* *${randomPercent}%* *ياخوي اعقل شوية يعني يا ${command.replace('how', '').toUpperCase()}*_`
  }

  if (command == 'جميل') {
    reply = `_*${displayText}* *نسبة جماله* *${randomPercent}%* *يا زينك بس فديت الـ ${command.replace('how', '').toUpperCase()}*_`
  }

  if (command == 'puto') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()},* *MÁS INFORMACIÓN A SU PRIVADO 🔥🥵 XD*_`
  }

  if (command == 'puta') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()},* *MÁS INFORMACIÓN A SU PRIVADO 🔥🥵 XD*_`
  }

  if (command == 'manco') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()} 💩*_`
  }

  if (command == 'manca') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()} 💩*_`
  }

  if (command == 'rata') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()} 🐁 COME QUESO 🧀*_`
  }

  if (command == 'prostituto') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()} 🫦👅, QUIEN QUIERE DE SUS SERVICIOS? XD*_`
  }

  if (command == 'prostituta') {
    reply = `_*${displayText}* *ES* *${randomPercent}%* *${command.replace('how', '').toUpperCase()} 🫦👅, QUIEN QUIERE DE SUS SERVICIOS? XD*_`
  }

  // ارسل الرد، مع المنشن لو موجود
  return conn.reply(m.chat, reply.trim(), m, mentioned ? { mentions: mentioned } : {})

} // نهاية handler

handler.help = ['ورع', 'اهبل', 'خروف', 'جميل', 'غباء', 'ذكاء', 'manco', 'manca', 'rata', 'puto', 'puta', 'prostituta', 'prostituto'].map(v => v + ' @tag | nombre')
handler.tags = ['calculator']
handler.command = /^ورع|اهبل|خروف|جميل|غباء|ذكاء|manco|manca|rata|puto|puta|prostituta|prostituto/i
export default handler