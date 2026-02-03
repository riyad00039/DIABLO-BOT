import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

function clockString(ms) {
  if (isNaN(ms)) return '00:00'
  let h = Math.floor(ms / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  return [h, m, s]
    .map((v, i) => v > 0 || i > 0 ? v.toString().padStart(2, '0') : null)
    .filter(v => v !== null)
    .join(':')
}

function getUserRank(level = 0) {
  const ranks = [
    { min: 81, rank: 'مشير 👑' },
    { min: 71, rank: 'فريق أول 🐺' },
    { min: 61, rank: 'لواء 🦅' },
    { min: 51, rank: 'عميد 🪖' },
    { min: 41, rank: 'عقيد ⚔️' },
    { min: 31, rank: 'رائد 🛰' },
    { min: 21, rank: 'نقيب 🪶' },
    { min: 16, rank: 'ملازم 🧑‍✈️' },
    { min: 11, rank: 'رقيب 🛡' },
    { min: 6, rank: 'عريف 🎖' },
    { min: 3, rank: 'جندي 🪖' },
    { min: 0, rank: 'مواطن 🧍‍♂️' }
  ]
  return ranks.find(r => level >= r.min)?.rank || 'مواطن 🧍‍♂️'
}

const handler = async (m, { conn }) => {
  try {
    // 💜 الريأكت قبل إرسال الرسالة
    await conn.sendMessage(m.chat, { react: { text: '💜', key: m.key } })

    let uptime = clockString(process.uptime() * 1000)
    let user = global.db?.data?.users?.[m.sender] || {}
    let name
    try { name = await conn.getName(m.sender) } catch { name = "مستخدم مجهول" }

    let level = user.level || 0  
    let role = getUserRank(level)  
    let exp = user.exp || 0  
    let limit = user.limit || 0  
    let isPrems = user.premium || false  
    let rtotalreg = Object.keys(global.db?.data?.users || {}).length  

    const Elsony = 'https://files.catbox.moe/cabl8e.jpg'  
    const media = await prepareWAMessageMedia({ image: { url: Elsony } }, { upload: conn.waUploadToServer })  

    // 🕯 الأقسام الرئيسية
    const sections = [  
      { emoji: '🎮', title: 'قـسـم الألعـاب', id: '.ق1' },  
      { emoji: '🛡', title: 'قـسـم المشرفين', id: '.ق2' },  
      { emoji: '🛠', title: 'قـسـم الأدوات', id: '.ق3' },  
      { emoji: '⬇️', title: 'قـسـم التحميل', id: '.ق4' },  
      { emoji: '🎬', title: 'قـسـم الأنـمـي', id: '.ق5' },  
      { emoji: '🧩', title: 'قـسـم الاسـتـيـكـرات', id: '.ق6' },  
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
      title: `╭━━━〔♟️ 💜 ᖇYᘔO ᗷOT 💜 〕━━━⬣\n┃ ➟ ${s.emoji} ${s.title}\n╰━━━━━━━━━━━━━━━━━━━━━━⬣`,  
      highlight_label: '💜 ᖇYᘔO ᗷOT 💜',  
      rows: [{ header: s.emoji, title: `「♟️ ${s.title} 💜」`, id: s.id }]  
    }))  

    // 🧩 الأقسام الإضافية بنفس تنسيق الأساسية
    const extraSections = [
      { emoji: '🤖', title: 'بوت فرعي', id: '.code' },
      { emoji: '📶', title: 'البنق', id: '.ping' },
      { emoji: '👨‍💻', title: 'مطور البوت', id: '.المطور' },
      { emoji: '💬', title: 'الدعم الفني', id: '.الدعم' }
    ].map(s => ({
      title: `╭━━━〔♟️ 💜 ᖇYᘔO ᗷOT 💜 〕━━━⬣\n┃ ➟ ${s.emoji} ${s.title}\n╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
      highlight_label: '💜 ᖇYᘔO ᗷOT 💜',
      rows: [{ header: s.emoji, title: `「♟️ ${s.title} 💜」`, id: s.id }]
    }))

    // الأزرار
    const buttons = [  
      {  
        name: 'single_select',  
        buttonParamsJson: JSON.stringify({  
          title: '﹝اخـتـر الـقـسـم الـمـنـاسـب﹞',  
          sections  
        })  
      },  
      {  
        name: 'single_select',  
        buttonParamsJson: JSON.stringify({  
          title: '﹝أوامــر إضافـيــة﹞',  
          sections: extraSections  
        })  
      },  
      {  
        name: 'cta_url',  
        buttonParamsJson: '{"display_text":"﹝القــــــنــاه﹞","url":"https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A"}'  
      }  
    ]  

    // نص الرسالة
    const text = `
*╮━〔💜 وُيـــــــّلڪم 💜〕━⬣*
*┃ ➟ أهلاً وسهلاً بك يا @${m.sender.split('@')[0]}*
*┃ ➟ نتمنى لك وقتاً ممتعاً 💎*
*╯━━━━━━━━━━━━━━━━⬣*
*╮━〔💜 مـعـلـومـاتـك 💜〕━⬣*
*┃ ➟ 🏅 المستوى: ${level}*
*┃ ➟ 🌟 الرتبة: ${role}*
*┃ ➟ 💼 الخبرة: ${exp}*
*┃ ➟ 💎 الألماس: ${limit}*
*╯━━━━━━━━━━━━━━━━⬣*
*╮━〔💜 حـالـة الـبـوت 💜〕━⬣*
*┃ ➟ 🤖 اسـم الـبـوت: ᖇYᘔO ᗷOT*
*┃ ➟ 🛠 المطور: ᖇYᘔO*
*┃ ➟ 🔋 التشغيل: ${uptime}*
*┃ ➟ 👤 المستخدمين: ${rtotalreg}*
*╯━━━━━━━━━━━━━━━━⬣*
`

    const msg = generateWAMessageFromContent(m.chat, {  
      viewOnceMessage: {  
        message: {  
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },  
          interactiveMessage: proto.Message.InteractiveMessage.create({  
            header: proto.Message.InteractiveMessage.Header.create({  
              title: '',  
              hasMediaAttachment: true,  
              ...media  
            }),  
            body: proto.Message.InteractiveMessage.Body.create({ text }),  
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "💜 ᖇYᘔO ᗷOT 💜" }),  
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })  
          })  
        }  
      }  
    }, { userJid: m.sender })  

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' }, { quoted: m })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'الاوامر', 'القائمة', 'اوامر', 'مهام']

export default handler