import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const timeout = 60000
const reward = 500

let handler = async (m, { conn, command }) => {
  conn.obito = conn.obito || {}
  const id = m.chat

  // 📍 الرد على الأزرار (الإجابات)
  if (command.startsWith('مجوب_')) {
    let obito = conn.obito[id]
    if (!obito) {
      return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ لا توجد لعبة نشطة حالياً ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
    }

    let selectedIndex = parseInt(command.split('_')[1])
    if (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > 4) {
      return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚫 اختيار غير صالح ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
    }

    let selectedAnswer = obito.options[selectedIndex - 1]
    let isCorrect = obito.correctAnswer === selectedAnswer

    if (isCorrect) {
      await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇إجـابـة صـحـيـحـة✅ ↞*
*⎆┇الـجـائـزة💰↞ 『${reward}xp』*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
      global.db.data.users[m.sender].exp += reward
      clearTimeout(obito.timer)
      delete conn.obito[id]
    } else {
      obito.attempts -= 1
      if (obito.attempts > 0) {
        await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇إجـابـة خـاطـئـة❌ ↞*
*⎆┇المـحـاولات الـبـاقـيـة⎆↞ 『${obito.attempts}』*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
      } else {
        await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇إجـابـة خـاطـئـة❌ ↞*
*⎆┇انـتـهـت مـحـاولاتـك 😔↞*
*⎆┇الإجـابـة الـصـحـيـحـة✨↞ 『${obito.correctAnswer}』*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
        clearTimeout(obito.timer)
        delete conn.obito[id]
      }
    }
    return
  }

  // 🎯 بداية اللعبة
  try {
    if (conn.obito[id]) {
      return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ لَديكَ لُعبَة نَشِطَة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
    }

    const response = await fetch('https://raw.githubusercontent.com/DK3MK/worker-bot/main/eye.json')
    const data = await response.json()

    const item = data[Math.floor(Math.random() * data.length)]
    const { img, name } = item

    let options = [name]
    while (options.length < 4) {
      let random = data[Math.floor(Math.random() * data.length)].name
      if (!options.includes(random)) options.push(random)
    }
    options.sort(() => Math.random() - 0.5)

    const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer })

    const interactiveMessage = {
      body: {
        text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇الـوقـت⏳↞ 『60 ثانية』*
*⎆┇الـجـائـزة💰↞ 『${reward}xp』*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

🧠 *تعرّف على شخصية الأنمي من العين!*
اختر الإجابة الصحيحة من الأزرار أدناه 👇


`,
      },
      footer: { text: 'ᖇYᘔO ᗷOT ' },
      header: {
        title: '> 👁️ لعبة ريـــزو - عين الأنمي',
        subtitle: 'اختر الجواب الصحيح ↓',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage,
      },
      nativeFlowMessage: {
        buttons: options.map((option, index) => ({
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: `⌖${index + 1}⌖⇇『${option}』`,
            id: `.مجوب_${index + 1}`
          })
        })),
      },
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: { interactiveMessage },
      },
    }, { userJid: conn.user.jid, quoted: m })

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    conn.obito[id] = {
      correctAnswer: name,
      options: options,
      timer: setTimeout(async () => {
        if (conn.obito[id]) {
          await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⏳ انتهى الوقت ↞*
*⎆┇الإجـابـة الـصـحـيـحـة✨↞ 『${name}』*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
          delete conn.obito[id]
        }
      }, timeout),
      attempts: 2
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ حدث خطأ أثناء بدء اللعبة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`, m)
  }
}

handler.help = ['عين']
handler.tags = ['games']
handler.command = /^(عين|عين|مجوب_\d+)$/i

export default handler