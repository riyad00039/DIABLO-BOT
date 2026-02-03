import axios from 'axios'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, command }) => {

    // الكلمات المفتاحية للبحث حسب الأمر
    const searchMap = {
        "ايديت-كوره": "كوره edit",
        "ايديت-انمي": "انمي edit",
        "ايديت-مختلط": "مختلط edit",
        "ايديت-اغنيه": "اغنيه edit",
        "دراغون-بول": "دراغونبول edit",
        "ايديت": "edit"
    }

    let text = searchMap[command]
    if (!text) return

    // الزخرفة
    const frameStart = '╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐\n'
    const frameEnd   = '\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐'

    // تفاعل أول
    await message.react("⌛")
    await conn.reply(message.chat, `${frameStart}*┇🕑 جاري جلب الايديت الخاص بك...*${frameEnd}`, message)

    async function createVideoMessage(url) {
        const { videoMessage } = await generateWAMessageContent({ video: { url } }, { upload: conn.waUploadToServer })
        return videoMessage
    }

    try {
        // جلب النتائج من API
        let { data: response } = await axios.get('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + encodeURIComponent(text))
        let searchResults = response.data

        if (!searchResults || searchResults.length === 0) throw "لا يوجد فيديوهات"

        // أخذ أول فيديو فقط
        const videoUrl = searchResults[0].nowm
        const videoMessage = await createVideoMessage(videoUrl)

        // إرسال الفيديو
        await conn.relayMessage(message.chat, { videoMessage }, { messageId: message.key.id })
        await message.react("✅")

    } catch (error) {
        await message.react("❌")
        await conn.reply(message.chat, `${frameStart}*⎆┇ ᖇYᘔO ᗷOT ❌ حدث خطأ*\n*⎆┇ ${error}*${frameEnd}`, message)
    }
}

// الأوامر الجديدة بصيغة underscore
handler.command = ["ايديت-كوره","ايديت-انمي","ايديت-مختلط","ايديت-اغنيه","دراغون-بول","ايديت"]
handler.tags = ['buscador']
handler.help = handler.command

export default handler