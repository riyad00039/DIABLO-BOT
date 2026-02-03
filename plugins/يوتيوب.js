/*
• تم الإنشاء بواسطة Felix 💜
• الإصدار الكامل لبحث YouTube + بطاقات تفاعلية + أزرار تحميل
• يعمل بأمر: .يوتيوب <كلمة>
*/

import yts from 'yt-search'
import baileys from '@whiskeysockets/baileys'

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys

const youtubeSearch = async (m, { conn, text, usedPrefix }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `❌ اكتب ما تريد البحث عنه في YouTube.\n\n📌 مثال:\n${usedPrefix}يوتيوب اغاني راب حماسيه`,
      m
    )

  await m.react('⏳')
  conn.reply(m.chat, `🔍 *جارٍ البحث عن:* ${text}`, m)

  async function createImageMessage(url) {
    const { imageMessage } = await generateWAMessageContent(
      { image: { url } },
      { upload: conn.waUploadToServer }
    )
    return imageMessage
  }

  try {
    const search = await yts(text)
    const results = search.videos.slice(0, 6) // عرض أول 6 فيديوهات فقط

    if (!results.length) {
      await m.react('❌')
      return conn.reply(m.chat, '❌ لم يتم العثور على أي نتائج.', m)
    }

    let cards = []
    for (let v of results) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `
🎬 *${v.title.substring(0, 60)}*
👤 القناة: ${v.author.name}
⏱️ المدة: ${v.timestamp}
👁️ المشاهدات: ${v.views.toLocaleString()}
`.trim()
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: true,
          imageMessage: await createImageMessage(v.thumbnail)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '🔗 فتح الفيديو',
                url: v.url
              })
            },
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '🎧 تحميل صوت',
                id: `.صوت ${v.url}`
              })
            },
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '🎥 تحميل فيديو',
                id: `.فيديو ${v.url}`
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
                text: `
╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣
┃ 🔎 *نتائج البحث في YouTube لـ:* ${text}
┃ اختر الفيديو الذي ترغب بمشاهدته أو تحميله 👇
╰━━━━━━━━━━━━⬣
                `.trim()
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '🎬 YouTube Search - 💜 ᖇYᘔO ᗷOT 💜'
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
    conn.reply(m.chat, '⚠️ حدث خطأ أثناء جلب نتائج YouTube.', m)
  }
}

youtubeSearch.help = ['يوتيوب <الكلمة>']
youtubeSearch.tags = ['media', 'video']
youtubeSearch.command = /^يوتيوب$/i
youtubeSearch.register = true

export default youtubeSearch