import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  const decorate = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇▸ ${msg}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

  try {
    console.log(`[${command}] triggered by: ${m.sender || m.key?.remoteJid || 'unknown'}`)

    // تحقق من الرد (reply)
    if (!m.quoted) {
      return await m.reply(
        decorate(`⚠️ اعمل ريبلاي على الاستيكر اللي عاوز تحوله لفيديو\n*استخدم:${usedPrefix + command}*`)
      )
    }

    let mime = m.quoted.mimetype || (m.quoted.msg && Object.values(m.quoted.msg)[0]?.mimetype) || ''
    if (!/webp|audio|image|video/.test(mime)) {
      return await m.reply(decorate(`⚠️ الملف المقتبس يجب أن يكون استيكر (webp) أو ملف صوت/صورة/فيديو`))
    }

    const downloadQuotedMedia = async () => {
      try { if (typeof m.quoted.download === 'function') return await m.quoted.download() } catch {}
      try { if (m.quoted && m.quoted.msg && typeof conn.download === 'function') return await conn.download(m.quoted.msg) } catch {}
      throw new Error('فشل تحميل الملف المقتبس — تأكد من أن جلسة conn تدعم التحميل')
    }

    const media = await downloadQuotedMedia()
    if (!media || (Buffer.isBuffer(media) === false && typeof media !== 'string')) {
      throw new Error('الوسائط المُحمّلة ليست Buffer أو URL')
    }

    let out = null
    if (/webp/.test(mime)) {
      out = await webp2mp4(media)
    } else if (/audio/.test(mime)) {
      out = await ffmpeg(media, [
        '-filter_complex', 'color',
        '-pix_fmt', 'yuv420p',
        '-crf', '51',
        '-c:a', 'copy',
        '-shortest'
      ], 'mp3', 'mp4')
    } else if (/image/.test(mime)) {
      out = await ffmpeg(media, [
        '-loop', '1',
        '-i', 'pipe:0',
        '-c:v','libx264',
        '-t','6',
        '-pix_fmt','yuv420p',
        '-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2'
      ], 'png', 'mp4')
    } else if (/video/.test(mime)) {
      out = media
    }

    let videoBuffer = null
    if (Buffer.isBuffer(out)) videoBuffer = out
    else if (typeof out === 'object' && out !== null) {
      if (Buffer.isBuffer(out.result)) videoBuffer = out.result
      else if (Buffer.isBuffer(out.data)) videoBuffer = out.data
      else if (typeof out.url === 'string') {
        return await conn.sendMessage(m.chat, { video: { url: out.url }, caption: decorate(`✅ تم تنفيذ طلبك بنجاح! 🎉\n> ᖇYᘔO ᗷOT`) }, { quoted: m })
      } else throw new Error('مخرجات التحويل غير معروفة (object)')
    } else if (typeof out === 'string') {
      return await conn.sendMessage(m.chat, { video: { url: out }, caption: decorate(`✅ تم تنفيذ طلبك بنجاح! 🎉\n> ᖇYᘔO ᗷOT`) }, { quoted: m })
    } else throw new Error('تعذر استخراج البافر الناتج من عملية التحويل.')

    // إرسال الفيديو النهائي مع اسم البوت
    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'sticker.mp4',
      caption: decorate(`✅ تم تنفيذ طلبك بنجاح! 🎉\n> ᖇYᘔO ᗷOT`)
    }, { quoted: m })

  } catch (err) {
    console.error('handler error:', err)
    await m.reply(decorate(`❌ فشل تنفيذ الأمر: ${err.message || err}`))
  }
}

handler.help = ['tovideo']
handler.tags = ['sticker']
handler.command = ['لفديو', 'tomp4', 'لمقطع', 'لفيديو']

export default handler