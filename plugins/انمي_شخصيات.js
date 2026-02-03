/*
• @Felix — صور شخصيات الأنمي 💜
• يرسل صور فورية لأي اسم من القائمة
*/

import fetch from 'node-fetch'
import baileys from '@whiskeysockets/baileys'

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys

const handler = async (m, { conn, command }) => {
  const query = command.trim().replace(/^\.*/, '') // حذف النقطة لو موجودة
  await m.react('⏳')
  conn.reply(m.chat, `⏱️ *جارٍ تحميل صور ${query}...*`, m)

  try {
    const res = await fetch(`https://api.dorratz.com/v2/pinterest?q=anime ${encodeURIComponent(query)}`)
    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0) {
      await m.react('❌')
      return conn.reply(m.chat, `❌ لم أجد أي صور لـ ${query}.`, m)
    }

    // نعرض أول 6 صور فقط كبطاقات
    const images = data.slice(0, 6).map(item => item.image_large_url || item.image)
    let cards = []
    let counter = 1

    async function createImageMessage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      )
      return imageMessage
    }

    for (let imageUrl of images) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `📸 *صورة ${query} رقم ${counter++}*`
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: true,
          imageMessage: await createImageMessage(imageUrl)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: 'copias',
                copy_code: imageUrl
              })
            }
          ]
        })
      })
    }

    const finalMessage = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `> 🔍 *صور ${query} — جاهزة!*`
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              })
            })
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, finalMessage.message, { messageId: finalMessage.key.id })
    await m.react('✅')
  } catch (error) {
    console.error(error)
    await m.react('❌')
    conn.reply(m.chat, '⚠️ حدث خطأ أثناء جلب الصور.', m)
  }
}

// الأوامر المتاحة = أسماء الشخصيات
handler.command = [
  'اكيرا', 'اكيوياما', 'آنا', 'اسونا', 'ايزوزو', 'بوروتو', 'شيهو', 'تشيتوجي', 'ديدارا',
  'ايرزا', 'ايلينا', 'ايمليا', 'هستيا', 'هيناتا', 'انزوري', 'ايتاتشي', 'ايتوري', 'كاغا',
  'كاغورا', 'كاوري', 'كينيكي', 'كوتوري', 'كورومي', 'مادارا', 'ميكاسا', 'ميكيو', 'ميناتو',
  'ناروتو', 'نيزوكو', 'ساجيري', 'ساسوكي', 'ساكورا', 'كاكاشي', 'زورو', 'لوفي', 'ايتشيقو',
  'ريمن', 'ايميليا', 'شينوبو', 'كريستو', 'كاجومي', 'كيسامي', 'اريكا', 'ريكا', 'ليفي', 'ايتشي'
]

// التصنيف
handler.tags = ['anime']
handler.help = handler.command
handler.register = true

export default handler