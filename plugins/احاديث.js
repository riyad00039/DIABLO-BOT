import axios from 'axios';
import { default as baileys } from '@whiskeysockets/baileys';

const { proto, generateWAMessageFromContent, generateWAMessageContent } = baileys;

let handler = async (message, { conn, usedPrefix, command }) => {
  const searchQueries = ['حديث', 'الرسول صلى الله عليه وسلم', 'حديث شريف', 'حديث نبوي'];
  const searchQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

  async function createVideoMessage(url) {
    const content = await generateWAMessageContent({ video: { url } }, { upload: conn.waUploadToServer });
    return content.videoMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  try {
    // 1️⃣ تفاعل رمزي عند بدء البحث
    await conn.sendMessage(message.chat, { react: { text: "🔍", key: message.key } });

    // 2️⃣ رسالة "جارٍ تحميل الأحاديث..."
    await conn.sendMessage(message.chat, { text: "*⏱️جارٍ تحميل الأحاديث...* " }, { quoted: message });

    // 3️⃣ جلب النتائج
    const { data: response } = await axios.get('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + encodeURIComponent(searchQuery));
    let searchResults = response.data || [];
    shuffleArray(searchResults);
    let selectedResults = searchResults.slice(0, 7);

    const cards = [];
    for (let result of selectedResults) {
      const videoMsg = await createVideoMessage(result.nowm);
      cards.push({
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title || 'ᖇYᘔO ᗷOT',
          hasMediaAttachment: true,
          videoMessage: videoMsg
        }),
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: 'ᖇYᘔO ᗷOT' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      });
    }

    const interactiveContent = proto.Message.InteractiveMessage.fromObject({
      body: proto.Message.InteractiveMessage.Body.create({ text: `نتائج البحث عن: ${searchQuery}` }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: '🔎 ᖇYᘔO ᗷOT' }),
      header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
    });

    const responseMessage = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: interactiveContent
        }
      }
    }, { quoted: message });

    await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

  } catch (error) {
    console.error(error);
    await conn.reply(message.chat, '❌ حدث خطأ أثناء البحث: ' + error.message, message);
  }
};

handler.help = ['دين'];
handler.tags = ['شانكس'];
handler.command = ['tiktoksearch','تصفح2','احاديث'];

export default handler;