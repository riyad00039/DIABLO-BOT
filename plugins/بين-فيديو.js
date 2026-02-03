import axios from "axios";

let handler = async (m, { conn, text }) => {
    const decorate = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇▸ ${msg}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

    // إذا لم يُدخل المستخدم رابط
    if (!text) {
        await m.reply(decorate("المرجو توفير رابط فيديو بينترست لتحميله 🪄📿"));
        return;
    }

    try {
        // ⏳ تفاعل التحميل
        await m.react("⏳");
        await m.reply(decorate("⏱️ جاري تحميل الفيديو من بينترست..."));

        const { medias, title } = await pindl(text);

        if (!medias || !Array.isArray(medias)) throw "رابط غير صالح";

        let mp4 = medias.filter(v => v.extension === "mp4");

        if (mp4.length > 0) {
            const size = formatSize(mp4[0].size);

            // ✅ تفاعل النجاح
            await m.react("✅");

            await conn.sendMessage(
                m.chat,
                { 
                    video: { url: mp4[0].url }, 
                    mimetype: "video/mp4",
                    caption: decorate(
                        `تم تحميل الفيديو من بينترست بنجاح 🪄✅\nالجودة: ${mp4[0].quality}\nالحجم: ${size}`
                    )
                },
                { quoted: m }
            );
        } else if (medias[0]) {
            await conn.sendFile(
                m.chat, 
                medias[0].url, 
                '', 
                decorate(`تم تحميل الفيديو من بينترست بنجاح 🪄✅\nعنوان: ${title}`), 
                m
            );
        } else {
            throw "لا يوجد فيديو قابل للتحميل لهذا الرابط.";
        }
    } catch (e) {
        // ❌ تفاعل الخطأ
        await m.react("❌");
        await conn.sendMessage(
            m.chat, 
            { text: decorate(`خطأ: ${e.message || e}`) },
            { quoted: m }
        );
    }
};

handler.help = ["اوبيتو"];
handler.command = /^(بين_فيديو)$/i;
handler.tags = ["اوبيتو"];

export default handler;

async function pindl(url) {
    try {
        const apiEndpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
        const params = { url };
        
        let { data } = await axios.get(apiEndpoint, { params });

        if (!data || !data.medias) throw "Invalid API response.";

        return data;
    } catch (e) {
        console.error("Error in pindl function:", e.message);
        throw "فشل في جلب البيانات من Pinterest Downloader. حاول مجددًا.";
    }
}

function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}