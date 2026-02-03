// plugins/fun/marry.js
// أمر: زواج (يحفظ الزواج في قاعدة global.db.data.marriages)

const handler = async (m, { conn, text }) => {
  try {
    // تأكد وجود قاعدة البيانات
    if (!global.db) global.db = { data: { marriages: {} }, write: async () => {} }
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.marriages) global.db.data.marriages = {}

    const images = [
      "https://files.catbox.moe/91tdch.jpg",
      "https://files.catbox.moe/bummq6.jpg",
      "https://files.catbox.moe/m9km37.jpg",
      "https://files.catbox.moe/1t3o0y.jpg"
    ]

    const phrases = [
      "يا رب تتمم على خير وميحصلش اللي احنا خايفينه 😂",
      "يا سلام يا عريس! خلّيها حياة سعيدة ومليانة فكّه 🇪🇬",
      "مبروك مقدماً — الف مبروك واوعى تنسى العفريت الصغير 🤵💍",
      "يا رب دايماً في حب وضحك وصحة — ألف مبروك مقدماً!",
      "النهاردة بداية قصة جديدة، وربنا يتمم بالخير 👰🤵"
    ]

    const pickedImage = images[Math.floor(Math.random() * images.length)]
    const pickedPhrase = phrases[Math.floor(Math.random() * phrases.length)]

    // تحديد العروسة
    let brideJid = null
    if (m.mentionedJid && m.mentionedJid.length) {
      brideJid = m.mentionedJid[0]
    } else if (text && text.trim()) {
      let candidate = text.trim().split(/\s+/)[0]
      candidate = candidate.replace(/^\+/, "").replace(/\D/g, "")
      if (candidate.length >= 8) brideJid = candidate + "@s.whatsapp.net"
    }

    if (!brideJid) {
      return conn.sendMessage(m.chat, {
        text: "💍💗 اكتب الأمر مع منشن العروسة.\nمثال:\nزواج @user\nأو\nزواج 20123XXXXXXXX",
      }, { quoted: m })
    }

    const groomJid = m.sender
    const groom = "@" + groomJid.split("@")[0]
    const bride = "@" + brideJid.split("@")[0]

    // منع تكرار الزواج: تحقق إن أي طرف مش متزوج بالفعل
    const marriages = global.db.data.marriages
    // بحث سريع: هل العريس أو العروسة متزوجان؟
    const already = Object.values(marriages).find(v => v.groom === groomJid || v.bride === brideJid || v.groom === brideJid || v.bride === groomJid)
    if (already) {
      return conn.sendMessage(m.chat, { text: "⚠️ أحد الطرفين مسجل بالفعل في زواج. تأكد أولاً من أنهما غير متزوجين في النظام أو استخدم أمر الطلاق." }, { quoted: m })
    }

    const timestamp = Date.now()
    const id = `${groomJid}|${brideJid}|${timestamp}`

    // حفظ السجل
    marriages[id] = {
      id,
      groom: groomJid,
      bride: brideJid,
      chat: m.chat,
      timestamp
    }

    // حاول كتابة قاعدة البيانات إن وُفِّرت الدالة
    try { if (global.db.write) await global.db.write() } catch (e) { console.error('db.write failed', e) }

    const caption = `💗💍 *زواج رسمي* 💍💗

*المأذون ريـــزو👳🏻‍♂️📋*

*بارك الله لكما وجمعكما في حفره واحده*👳🏻‍♂️✨

*العريس🤵🏻‍♂️*: ${groom}
*العروسة👰🏻‍♀️*: ${bride}

*♡_♡ احلى فرحه النهارده اشوف ضرب نار بق 🐧💗:* 
${pickedPhrase}

*تاريخ التسجيل:* ${new Date(timestamp).toLocaleString()}`

    // إرسال
    const sentMsg = await conn.sendMessage(m.chat, {
      image: { url: pickedImage },
      caption,
      mentions: [groomJid, brideJid]
    }, { quoted: m })

    // ريأكت خاتم
    try {
      if (sentMsg && sentMsg.key) {
        await conn.sendMessage(m.chat, { react: { text: '💍', key: sentMsg.key } })
      }
    } catch (e) {
      console.error('react failed', e)
    }

    // تأكيد نصي
    await conn.sendMessage(m.chat, { text: `✅ تم تسجيل الزواج بين ${groom} و ${bride} بنجاح.` }, { quoted: sentMsg })

  } catch (err) {
    console.error('Error in marry handler:', err)
    await conn.sendMessage(m.chat, { text: "حصل خطأ أثناء تنفيذ أمر الزفاف." }, { quoted: m })
  }
}

handler.command = /^(زواج|زوجني)$/i
handler.group = true
export default handler