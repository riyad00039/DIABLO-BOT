import fetch from 'node-fetch'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
  let id = m.chat

  if (id in conn.tebakbendera) {
    conn.reply(m.chat, '⌖┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakbendera[id][0])
    throw false
  }

  // جلب البيانات من الملف الخارجي
  let src = await (await fetch('https://raw.githubusercontent.com/Hema732828/test11/main/manga.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]

  // نص الكابتشن
  let caption = `*╭━━━[ *${command.toUpperCase()}* ]━━━━⬣
┃⎆┇الـوقـت⏳↞ *${(timeout / 1000).toFixed(2)}* ثـواني┇
┃⎆┇الـجـائـزة💰↞ *${poin} نقاط*┇
┃⎆┇لو مش عارف الاجابة قول: *${usedPrefix}معرفش*
╰━━━〔 ᖇYᘔO ᗷOT 〕━━━━⬣*`

  // إرسال الصورة مع النص
  let msg = await conn.sendFile(m.chat, json.img, 'manga.jpg', caption, m)

  // تخزين اللعبة الجارية
  conn.tebakbendera[id] = [
    msg,
    json,
    poin,
    setTimeout(() => {
      if (conn.tebakbendera[id]) {
        conn.reply(
          m.chat,
          `❮ ⌛┇انتهي الوقت┇⌛❯
⎆┇الاجـابـة✅↞ *${json.name}*
╰━━━〔 🛡️ 1.4.9 〕━━━━━⬣`,
          conn.tebakbendera[id][0]
        )
        delete conn.tebakbendera[id]
      }
    }, timeout)
  ]
}

handler.help = ['guessflag']
handler.tags = ['game']
handler.command = /^مانغا/i

export default handler