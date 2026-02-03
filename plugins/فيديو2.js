import axios from "axios";

const handler = async (m, { conn, args, command }) => {
  if (!args[0])
    return conn.sendMessage(m.chat, { text: `❗ *الاستخدام الصحيح:*\n- *${command} <رابط يوتيوب>*\n\nالأوامر المدعومة:\n- يوتيوب144\n- يوتيوب240\n- يوتيوب360\n- يوتيوب480\n- يوتيوب720\n- يوتيوب1080\n- يوتيوبaudio` }, { quoted: m });

  const url = args[0];
  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url))
    return conn.sendMessage(m.chat, { text: "❌ يرجى إدخال رابط يوتيوب صالح." }, { quoted: m });

  // تحديد الجودة المطلوبة
  let format = "720";
  let qualityLabel = "720p";

  if (command === "اغنيه" || command === "يوتيوبaudio") {
    format = "mp3";
    qualityLabel = "صوت";
  } else if (command === "يوتيوب1080" || command === "1080") {
    format = "1080";
    qualityLabel = "1080p";
  } else {
    format = command.replace("يوتيوب", "");
    qualityLabel = `${format}p`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(
      `https://dark-api-one.vercel.app/api/youtube?url=${encodeURIComponent(url)}`
    );

    if (!data.status || !data.data?.download)
      return conn.sendMessage(m.chat, { text: "❌ تعذر الحصول على رابط التحميل." }, { quoted: m });

    const { title, type, download, thumbnail, duration } = data.data;

    const caption = `🎬 *العنوان:* ${title}\n📹 *الجودة:* ${qualityLabel}\n🕒 *المدة:* ${duration} ثانية`;

    if (format === "mp3") {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: download },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          caption,
          contextInfo: { externalAdReply: { title, mediaType: 1, renderLargerThumbnail: true, thumbnail: { url: thumbnail } } },
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: download },
          caption,
          contextInfo: { externalAdReply: { title, mediaType: 1, renderLargerThumbnail: true, thumbnail: { url: thumbnail } } },
        },
        { quoted: m }
      );
    }
  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, { text: `❌ حدث خطأ أثناء التحميل:\n${e.message}` }, { quoted: m });
  }
};

handler.help = [
  "يوتيوب144",
  "يوتيوب240",
  "يوتيوب360",
  "يوتيوب480",
  "يوتيوب720",
  "يوتيوب1080",
  "يوتيوبaudio",
  "اغنيه"
];
handler.command = [
  "144",
  "240",
  "360",
  "480",
  "720",
  "1080",
  "اغنيه"
];
handler.tags = ["تحميل"];

export default handler;