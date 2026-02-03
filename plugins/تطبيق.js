import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys' // (لا ضرر بوجوده، لكن لن نستخدمه هنا)

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const appName = args.join(' ').trim()
    if (!appName) {
      return m.reply(`╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐
> ❗ *ادخل اسم التطبيق الذي تريد*
> 🔰 مثال:
> ⟐  ${usedPrefix + command} WhatsApp
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐`)
    }

    await m.react('🔍')

    const apiUrl = `https://api-streamline.vercel.app/dlapk?search=${encodeURIComponent(appName)}`
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()

    // طباعة للاختبار — احذفها بعد التأكد
    console.log('API response:', JSON.stringify(data, null, 2))

    // تحقّق من شكل الـ response — الكود يحاول التعامل مع الاحتمالات الشائعة
    if (!data || (!data.id && !data.name)) {
      return m.reply('⊱ لم يتم العثور على التطبيق 💢 ⊰')
    }

    // قد تختلف المفاتيح حسب الـ API: file.path أو file.url أو file
    const name = data.name || data.title || '---'
    const file = data.file || {}
    const fileUrl = file.url || file.path || file.download || data.download || null
    const fileSize = file.size || 'غير متوفر'
    const icon = data.icon || data.image || data.thumbnail || null

    const teksnya = `╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐
🎗 *اسم التطبيق:* ${name}
📦 *حجم الملف:* ${fileSize}
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐`

    // أزرار
    const buttons = [
      {
        buttonId: `.تحميل_هنا ${fileUrl || 'لا يوجد رابط'}`,
        buttonText: { displayText: '〘 تحميل 🔰 〙' },
        type: 1
      }
    ]

    // إن لم يوجد أي أيقونة، نرسل الرسالة بدون صورة (caption + buttons)
    if (icon) {
      await conn.sendMessage(m.chat, {
        image: { url: icon },
        caption: teksnya,
        footer: '💜 ᖇYᘔO ᗷOT 💜',
        buttons,
        headerType: 4
      })
    } else {
      await conn.sendMessage(m.chat, {
        text: teksnya + `\n\nرابط التحميل: ${fileUrl || 'غير متوفر'}`,
        footer: '💜 ᖇYᘔO ᗷOT 💜',
        buttons
      })
    }
  } catch (err) {
    console.error('⚠️ خطأ في handler تطبيق:', err)
    await conn.sendMessage(m.chat, { text: '🚨 عذراً، حدث خطأ أثناء البحث عن التطبيق.' })
  }
}

handler.command = ['تطبيق', 'apk', 'بحث_تطبيق']

export default handler