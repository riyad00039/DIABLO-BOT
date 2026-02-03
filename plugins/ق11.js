/* 💎 تم التنسيق بواسطة 💜 ᖇYᘔO ᗷOT 💎 */
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

const handler = async (m, { conn }) => {
  try {
    let name = await conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    let role = user?.role || 'ذكاء اصطناعي 🤖'

    await conn.sendMessage(m.chat, { react: { text: '🖌️', key: m.key } })

    const imageUrl = 'https://files.catbox.moe/euq9d5.jpg'
    const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer })

    const sections = [
      { emoji: '🛡️', title: 'قـسـم المشرفين', id: '.ق2' },
      { emoji: '🛠️', title: 'قـسـم الأدوات', id: '.ق3' },
      { emoji: '⬇️', title: 'قـسـم التحميل والبحث', id: '.ق4' },
      { emoji: '🧩', title: 'قـسـم الاستيكارات', id: '.ق6' },
      { emoji: '🏦', title: 'قـسـم البنـك', id: '.ق7' },
      { emoji: '🤖', title: 'قـسـم الذكاء الاصطناعي', id: '.ق8' },
      { emoji: '🎭', title: 'قـسـم التسلية', id: '.ق9' },
      { emoji: '🕋', title: 'قـسـم الدين', id: '.ق10' },
      { emoji: '🖌️', title: 'قـسـم الزخارف', id: '.ق11' },
      { emoji: '⚔️', title: 'قـسـم النقابات', id: '.ق12' },
      { emoji: '🖼️', title: 'قـسـم الصور', id: '.ق13' },
      { emoji: '😎', title: 'قـسـم الوجوهات', id: '.ق14' },
      { emoji: '📜', title: 'القوانين', id: '.القواعد' }
    ].map(s => ({
      title: `╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣\n┃ ➟ ${s.emoji} ${s.title}\n╰━━━━━━━━━━━━⬣`,
      highlight_label: '💜 ᖇYᘔO ᗷOT 💜',
      rows: [{ header: s.emoji, title: `「${s.title} 💜」`, id: s.id }]
    }))

    let caption = `
╭━━〔🖌️ قـسـم الزخارف 💜〕━━⬣
┃ ➟ *مرحباً بك يا* 『${name}』
┃ ➟ *🏮 الرتبة:* ${role}
┃ ➟ *🖌️ قسم الزخارف جاهز لخدمتك*
╰━━━━━━━━━━━━⬣

╭━━〔🖌️ أوامـر الزخارف 💜〕━━⬣
┃ ➟ ﹝🅰️ *『زخرفه1』*﹞
┃ ➟ ﹝🅱️ *『زخرفه2』*﹞
┃ ➟ ﹝🆎 *『زخرفه3』*﹞
┃ ➟ ﹝🅾️ *『زخرفه4』*﹞
┃ ➟ ﹝🆑 *『زخرفه5』*﹞
┃ ➟ ﹝🎨 *『زخرفه6』*﹞
┃ ➟ ﹝✍️ *『زخرفه7』*﹞
┃ ➟ ﹝🖋️ *『زخرفه8』*﹞
┃ ➟ ﹝🧩 *『زخرفه9』*﹞
┃ ➟ ﹝🔤 *『زخرفه10』*﹞
┃ ➟ ﹝🔠 *『زخرفه11』*﹞
╰━━━━━━━━━━━━⬣

> 🖌️ *قسم الزخارف بإدارة 💜 ᖇYᘔO ᗷOT 💜*
`.trim()

    let msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: caption },
            footer: { text: '💜 ⦓ ᖇYᘔO ᗷOT ⦔ 💜' },
            header: { hasMediaAttachment: true, ...media },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "💜 عرض الأقسام 💜",
                    sections
                  })
                }
              ]
            }
          }
        }
      }
    }

    await conn.relayMessage(m.chat, msg, {})

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' }, { quoted: m })
  }
}

handler.command = ['ق11']
handler.tags = ['fonts']
handler.help = ['ق11']

export default handler