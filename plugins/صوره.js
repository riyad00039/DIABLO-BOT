import { googleImage } from '@bochilteam/scraper'

let handler = async (m, { conn, text, command }) => {

  const prohibited = ['caca','polla','porno','porn','gore','cum','semen','puta','puto','culo','putita','putito','pussy','hentai','pene','coño','asesinato','zoofilia','mia khalifa','desnudo','desnuda','cuca','chocha','muertos','pornhub','xnxx','xvideos','teta','vagina','marsha may','misha cross','sexmex','furry','furro','furra','xxx','rule34','panocha','pedofilia','necrofilia','pinga','horny','ass','nude','popo','nsfw','femdom','futanari','erofeet','sexo','sex','yuri','ero','ecchi','blowjob','anal','ahegao','pija','verga','trasero','violation','violacion','bdsm','cachonda','+18','cp','mia marin','lana rhoades','cepesito','hot','buceta','xxx']

  // تحقق من الكلمات الممنوعة
  if (prohibited.some(word => text?.toLowerCase()?.includes(word))) 
    return conn.reply(m.chat, '🚩 *لن أعطي نتائج لطلبك*', m)

  if (!text) 
    return conn.reply(m.chat, `🎌 *سوف تحتاج إلى إدخال النص*\n\nمثال: !${command} ناروتو`, m)

  try {
    await m.react('⏳') // إشارة تحميل

    const results = await googleImage(text)
    if (!results || results.length === 0)
      return conn.reply(m.chat, '❌ لم يتم العثور على أي صورة.', m)

    const image = results.getRandom() // اختيار صورة عشوائية
    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: `🚩 *الطلب:* ${text}\n\nᖇYᘔO ᗷOT ✨`
    }, { quoted: m })

    await m.react('✅') // إشارة نجاح
  } catch (err) {
    console.error(err)
    await m.react('❌')
    conn.reply(m.chat, '⚠️ حدث خطأ أثناء جلب الصورة.', m)
  }
}

handler.help = ['gimage', 'imagen']
handler.tags = ['imagenes']
handler.command = /^(gimage|صوره|صور)$/i
handler.limit = true

export default handler