/* 💎 تم التنسيق بواسطة 𝑹𝑶𝑫𝑼-𝑩𝗢𝗧 💎 */
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

const handler = async (m, { conn }) => {
  try {
    let name = await conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    let role = user?.role || 'عضو 🕹️'
    let warns = user?.warn || 0

    await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } })

    const imageUrl = 'https://files.catbox.moe/ik0213.jpg' // صورة قسم الألعاب
    const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer })

    // 🔹 الأقسام الكاملة
    const sections = [
      { emoji: '🎮', title: 'قـسـم الألعـاب', id: '.ق1' },
      { emoji: '🛡', title: 'قـسـم المشرفين', id: '.ق2' },
      { emoji: '🛠', title: 'قـسـم الأدوات', id: '.ق3' },
      { emoji: '⬇️', title: 'قـسـم التحميل', id: '.ق4' },
      { emoji: '🎬', title: 'قـسـم الأنـمـي', id: '.ق5' },
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

    // 💬 رسالة قسم الألعاب مع إيموجي مناسب لكل أمر
    let caption = `
╭━━〔💜 ᗯᗴᒪᑕOᗰᗴ 💜〕━━⬣
┃ ➟ *مرحباً بك يا* 『${name}』
┃ ➟ *🎭 الرتبة:* ${role}
┃ ➟ *🎮 قسم الألعاب جاهز لخدمتك*
╰━━━━━━━━━━━━⬣

╭━━〔🎮 أوامـر الألعاب 💜〕━━⬣
┃ ➟ *🧩 ⌟احزر⌜*
┃ ➟ *👁️ ⌟عين⌜*
┃ ➟ *🧠 ⌟علم⌜*
┃ ➟ *✋ ⌟كت⌜*
┃ ➟ *🔓 ⌟فكك⌜*
┃ ➟ *🌍 ⌟عاصمه⌜*
┃ ➟ *🪨 ⌟لعبه+حجر⌜*
┃ ➟ *✂️ ⌟لعبه+مقص⌜*
┃ ➟ *📄 ⌟لعبه+ورقه⌜*
┃ ➟ *❌ ⌟اكس⌜*
┃ ➟ *😃 ⌟ايموجي⌜*
┃ ➟ *📅 ⌟تاريخ⌜*
┃ ➟ *❓ ⌟سؤال⌜*
╰━━━━━━━━━━━━⬣

> 🎮 *قسم الألعاب بإدارة 💜ᖇYᘔO ᗷOT💜*
`.trim()

    // ⚙️ الرسالة التفاعلية
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

handler.command = ['ق1']
handler.tags = ['group']
handler.help = ['ق1']

export default handler