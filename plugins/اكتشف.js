import fs from 'fs'
import path from 'path'
import acrcloud from 'acrcloud'

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu',
})

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    if (!/audio|video/.test(mime)) {
      return m.reply('*🎧︙قم بالرد على مقطع صوتي أو فيديو قصير لاكتشاف الأغنية.*')
    }

    if ((q.msg || q).seconds > 120) {
      return m.reply('*⚠️︙يُرجى أن لا يتجاوز المقطع دقيقتين.*')
    }

    const media = await q.download()
    if (!media) return m.reply('*❌︙لم أستطع تحميل الملف.*')

    const ext = mime.split('/')[1]
    const tmpPath = path.join('./tmp', `${m.sender}.${ext}`)
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    fs.writeFileSync(tmpPath, media)

    const res = await acr.identify(fs.readFileSync(tmpPath))
    fs.unlinkSync(tmpPath)

    if (!res?.status?.code === 0 || !res?.metadata?.music?.length)
      return m.reply('*⚠️︙لم أتمكن من التعرف على هذه الأغنية.*')

    const info = res.metadata.music[0]
    const title = info.title || 'غير معروف'
    const artists = info.artists?.map(v => v.name).join(', ') || 'غير معروف'
    const album = info.album?.name || 'غير معروف'
    const genres = info.genres?.map(v => v.name).join(', ') || 'غير معروف'
    const release_date = info.release_date || 'غير معروف'

    const txt = `
╮─┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐  
┆ 🎵 *الأغنية:* ${title}
╯─┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐  

┆ ⎆ *تم التعرف على الموسيقى بنجاح!*  
┆  
┆ 🎤 *الفنانين:* ${artists}  
┆ 💽 *الألبوم:* ${album}  
┆ 🏷️ *النوع:* ${genres}  
┆ 📅 *تاريخ الإصدار:* ${release_date}  
┆  
╭─┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐  
> *ᖇYᘔO ᗷOT*   
╰─┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐
    `.trim()

    await m.reply(txt)
  } catch (e) {
    console.error(e)
    m.reply('*❌︙حدث خطأ أثناء محاولة التعرف على الموسيقى.*')
  }
}

handler.help = ['اكتشف']
handler.tags = ['tools']
handler.command = /^quemusica|اكتشف|whatmusic$/i

export default handler