import axios from 'axios'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, command }) => {

    // الكلمات المفتاحية للبحث حسب الأمر
    const searchMap = {
        "قران_فيد": "قران كريم بصوت هادئ وخاشع"
    }

    let text = searchMap[command]
    if (!text) return

    // الاطار
    const frameStart = '╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐\n'
    const frameEnd   = '\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐'

    // تفاعل أول
    await message.react("⌛")
    await conn.reply(message.chat, `${frameStart}*┇🕑 استغفر ربك لحين يأتي ...*${frameEnd}`, message)

    async function createVideoMessage(url) {
        const { videoMessage } = await generateWAMessageContent({
            video: { 
                url,
                caption: `${frameStart}*إليك فيديو القرآن الكريم 📿*\n> *💚اللهم اجعل القرآن الكريم ربيع قلوبنا💚*${frameEnd}`
            }
        }, { upload: conn.waUploadToServer })
        return videoMessage
    }

    try {
        // جلب النتائج من API
        let { data: response } = await axios.get('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + encodeURIComponent(text))
        let searchResults = response.data

        if (!searchResults || searchResults.length === 0) throw "لا يوجد فيديوهات"

        // اختيار فيديو عشوائي من النتائج
        let randomIndex = Math.floor(Math.random() * searchResults.length)
        const videoUrl = searchResults[randomIndex].nowm
        const videoMessage = await createVideoMessage(videoUrl)

        // إرسال الفيديو
        await conn.relayMessage(message.chat, { videoMessage }, { messageId: message.key.id })

        await message.react("✅")

    } catch (error) {
        await message.react("❌")
        await conn.reply(message.chat, `${frameStart}*❌ حدث خطأ*\n*⎆┇ ${error}*${frameEnd}`, message)
    }
}

// الاوامر
handler.command = ["قران_فيد"]
handler.tags = ['buscador']
handler.help = handler.command

export default handler