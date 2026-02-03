import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  const deco = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ ${msg} ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`

  if (!m.quoted) {
    return conn.sendMessage(m.chat, {
      text: deco(`*🚩 رد ع الملصق لتمتلكه*\n*مثال:*\n*.حقوق ريـــزو عمك*`)
    }, { quoted: m })
  }

  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw '❗ الرد يجب أن يكون على ملصق فقط'

    let img = await m.quoted.download()
    if (!img) throw '📥 فشل تحميل الملصق، حاول مرة أخرى'

    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
    } else {
      await conn.sendMessage(m.chat, {
        text: deco(`⚠️ حدث خطأ!\nتأكد أنك رديت على ملصق واستخدمت الصيغة الصحيحة:\n*.حقوق الاسم|ᖇYᘔO ᗷOT*`)
      }, { quoted: m })
    }
  }
}

handler.help = ['حقوق <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^حقوق|سرقة$/i

export default handler