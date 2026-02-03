/*
• @David-Chian + تعديل بواسطة Felix
• أمر bleach - يجلب صور عشوائية لأنمي بليتش من Pinterest
*/

import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('⏳')

    // 🔹 البحث التلقائي في Pinterest عن صور Bleach
    const res = await fetch(`https://api.dorratz.com/v2/pinterest?q=bleach%20anime`)
    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0)
      return conn.reply(m.chat, '❌ لم يتم العثور على صور لبليتش.', m)

    // 🔹 اختيار صورة عشوائية
    const randomImage = data[Math.floor(Math.random() * data.length)]

    // 🔹 إعداد الزر الواحد "التالي"
    const buttons = [
      {
        buttonId: `${usedPrefix + command}`,
        buttonText: { displayText: '➡️ التالي' },
        type: 1,
      },
    ]

    // 🔹 إرسال الصورة مباشرة
    await conn.sendMessage(m.chat, {
      image: { url: randomImage.image_large_url || randomImage.image },
      caption: `⚔️ *صورة من أنمي بليتش*`,
      footer: 'ᖇYᘔO ᗷOT ✨',
      buttons,
      headerType: 4,
    }, { quoted: m })

    await m.react('✅')
  } catch (err) {
    console.error(err)
    await m.react('❌')
    conn.reply(m.chat, '⚠️ حدث خطأ أثناء جلب صورة بليتش.', m)
  }
}

handler.help = ['bleach']
handler.tags = ['img']
handler.command = /^بليتش$/i
handler.register = true

export default handler