// 🎵 تحميل صوت من YouTube ⎆
// ᖇYᘔO ᗷOT 🧰

import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    let contoh = `${usedPrefix + command} سورة الكهف بصوت ماهر المعيقلي`
    return m.reply(
      `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ⚠️ كيفية الاستخدام ↞*
*⎆┇ اكتب رابط أو عنوان المقطع الصوتي الذي تريد تحميله.*
*⎆┇ 📌 مثال:*  
${contoh}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
      `.trim()
    )
  }

  await m.react("🎧")

  let url
  let query = text.trim()
  let videoInfo

  if (query.startsWith('http')) {
    url = query
    try {
      let search = await yts({ videoId: url.split('v=')[1] || url.split('/').pop() })
      videoInfo = search
    } catch (e) {
      throw `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ❌ لم أتمكن من الحصول على معلومات الفيديو ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
      `
    }
  } else {
    let search = await yts(query)
    if (!search.videos.length) throw `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ❌ لم يتم العثور على نتائج ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
    `
    videoInfo = search.videos[0]
    url = videoInfo.url
  }

  try {
    // إنشاء الكابشن مع الصورة والمعلومات
    let captionInfo = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ 🎵 ${videoInfo.title} ↞*
*⎆┇ 👤 القناة:* ${videoInfo.author.name}
*⎆┇ ⏰ المدة:* ${videoInfo.timestamp}
*⎆┇ 📊 المشاهدات:* ${videoInfo.views}
*⎆┇ 📅 النشر:* ${videoInfo.ago}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

*🎶 جاري تحميل الصوت...*
    `

    // إرسال الصورة + المعلومات في رسالة واحدة
    await conn.sendMessage(m.chat, {
      image: { url: videoInfo.thumbnail },
      caption: captionInfo
    }, { quoted: m })

    // تحميل الصوت
    let res = await fetch(`https://api.rapikzyeah.biz.id/api/downloader/donlotyete?url=${encodeURIComponent(url)}&type=mp3&quality=256`)
    let json = await res.json()

    if (!json.downloadUrl) {
      try {
        const apis = [
          `https://api.downloadermods.tk/ytmp3?url=${encodeURIComponent(url)}`,
          `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`,
          `https://api.azz.biz.id/api/ytmp3?url=${encodeURIComponent(url)}`
        ]
        
        for (let api of apis) {
          try {
            let altRes = await fetch(api)
            let altJson = await altRes.json()
            if (altJson.downloadUrl || altJson.url || altJson.result) {
              json.downloadUrl = altJson.downloadUrl || altJson.url || altJson.result
              break
            }
          } catch (e) { continue }
        }
        
        if (!json.downloadUrl) throw new Error('فشل جميع واجهات التحميل')
      } catch (altError) {
        throw `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ❌ لم يتم العثور على رابط التنزيل ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
        `
      }
    }

    // إرسال الصوت فقط
    await conn.sendMessage(m.chat, {
      audio: { url: json.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoInfo.title.replace(/[^\w\s]/gi, '')}.mp3`
    }, { quoted: m })

  } catch (e) {
    console.error('خطأ في التحميل:', e)
    await conn.sendMessage(m.chat, {
      text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ⚠️ حدث خطأ أثناء التحميل ↞*
*⎆┇ 📝 الخطأ:* ${e.message}
*⎆┇ ⎆ الحل:* حاول مرة أخرى أو استخدم رابط مختلف
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
      `
    }, { quoted: m })
    await m.react("❌")
    return
  }

  await m.react("✅")
}

handler.help = ['تحميل-صوت <رابط أو عنوان>']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'صوت']
handler.register = true

export default handler