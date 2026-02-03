import axios from "axios";

let handler = async (m, { conn, text }) => {

    const randomEmoji = () => {
        const emo = ["🎬","📥","📌","💾","📽️","🌐","✨","🎞️","✅"];
        return emo[Math.floor(Math.random() * emo.length)];
    }

    const deco = (msg) => 
`╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐
${msg}
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐`;

    if (!text) throw deco(`*${randomEmoji()} المرجو إرسال رابط فيديو بينترست لتحميله*`);

    // -------------------
    // تحريك رسالة "جار التحميل"
    // -------------------
    let frames = [
        `*${randomEmoji()} جاري تنزيل الفيديو.*`,
        `*${randomEmoji()} جاري تنزيل الفيديو..*`,
        `*${randomEmoji()} جاري تنزيل الفيديو...*`
    ];

    let i = 0;
    let sentMsg = await m.reply(deco(frames[i]));
    let anim = setInterval(async () => {
        i = (i + 1) % frames.length;
        try {
            await conn.sendMessage(m.chat, { text: deco(frames[i]), edit: sentMsg.key });
        } catch (e) {}
    }, 1000);

    try {
        const { medias, title } = await pindl(text);

        if (!medias || !Array.isArray(medias)) throw "الرابط غير صالح";

        let mp4 = medias.filter(v => v.extension === "mp4");

        clearInterval(anim); // وقف الحركة

        if (mp4.length > 0) {
            const size = formatSize(mp4[0].size);

            await conn.sendMessage(
                m.chat,
                {
                    video: { url: mp4[0].url },
                    caption: deco(`*${randomEmoji()} تم تنزيل الفيديو بنجاح*\nالجودة: ${mp4[0].quality}\nالحجم: ${size}`)
                },
                { quoted: m }
            );
        } else if (medias[0]) {
            await conn.sendMessage(
                m.chat,
                { text: deco(`*${randomEmoji()} تم تنزيل الفيديو بنجاح*\nالعنوان: ${title}`) },
                { quoted: m }
            );
        } else {
            throw "لا يوجد فيديو في هذا الرابط";
        }

    } catch (e) {
        clearInterval(anim);
        throw deco(`*⚠️ خطأ:* ${e}`);
    }
};

handler.help = ["بين_فيديو"];
handler.command = /^(بين_فيديو)$/i;
handler.tags = ["video"];

export default handler;

// -------------------
// دالة تحميل البيانات من Pinterest
// -------------------
async function pindl(url) {
    try {
        const apiEndpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
        const params = { url };

        let { data } = await axios.get(apiEndpoint, { params });

        if (!data || !data.medias) throw "Invalid API response.";

        return data;
    } catch (e) {
        console.error("Error in pindl function:", e.message);
        throw "فشل في جلب البيانات من Pinterest Downloader.";
    }
}

// -------------------
// دالة تحويل حجم الملف
// -------------------
function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}