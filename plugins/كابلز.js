import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  try {
    // 🔹 جلب قاعدة بيانات الصور من GitHub
    let res = await fetch('https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json')
    let data = await res.json()

    if (!Array.isArray(data) || data.length === 0) {
      return conn.reply(m.chat, '⚠️ لم يتم العثور على بيانات كابلز.', m)
    }

    // 🔹 اختيار زوج عشوائي من الصور (ولد + بنت)
    let cita = data[Math.floor(Math.random() * data.length)]

    // 🔹 إرسال صورة الولد
    await conn.sendMessage(m.chat, {
      image: { url: cita.cowo },
      caption: '👦🏻 *صورة الولد*'
    }, { quoted: m })

    // 🔹 إرسال صورة البنت
    await conn.sendMessage(m.chat, {
      image: { url: cita.cewe },
      caption: '👧🏻 *صورة البنت*'
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, '❌ حدث خطأ أثناء تحميل الصور، حاول لاحقاً.', m)
  }
}

handler.help = ['ppcouple', 'ppcp']
handler.tags = ['img']
handler.command = ['couplepp', 'كابلز']

export default handler