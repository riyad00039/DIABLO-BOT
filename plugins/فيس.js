import axios from 'axios';
import cheerio from 'cheerio';

async function facebookDownload(url) {
    try {
        const form = new URLSearchParams();
        form.append("q", url);
        form.append("vt", "home");

        const response = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (response.data.status === "ok") {
            const $ = cheerio.load(response.data.data);
            const videoQualities = [];
            $('table tbody tr').each((index, element) => {
                const quality = $(element).find('.video-quality').text().trim();
                const downloadLink = $(element).find('a.download-link-fb').attr("href");
                if (quality && downloadLink) {
                    videoQualities.push({ quality, downloadLink });
                }
            });

            const hdVideo = videoQualities.find(v => v.quality.toLowerCase().includes('hd'));
            const sdVideo = videoQualities.find(v => v.quality.toLowerCase().includes('sd'));
            const videoUrl = hdVideo ? hdVideo.downloadLink : sdVideo ? sdVideo.downloadLink : null;

            if (!videoUrl) throw new Error("لا يوجد رابط تحميل للفيديو.");
            return { videoUrl };
        } else {
            throw new Error("فشل تحميل الفيديو: " + response.data.message);
        }
    } catch (error) {
        throw error;
    }
}

const facebookHandler = async (m, { conn, text }) => {
    const decorate = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇▸ ${msg}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

    try {
        if (!text) throw "يرجى إدخال رابط من فيسبوك.";

        // ⏳ التفاعل أثناء البحث/التحميل
        await m.react("⏳");

        const result = await facebookDownload(text);

        if (result.videoUrl) {
            // ✅ تفاعل النجاح بعد التحميل
            await m.react("✅");

            await conn.sendMessage(m.chat, { 
                video: { url: result.videoUrl }, 
                mimetype: 'video/mp4', 
                caption: decorate("تم تحميل الفيديو بنجاح ⬇️") 
            }, { quoted: m });
        } else {
            throw "فشل تحميل الفيديو.";
        }
    } catch (error) {
        await m.react("❌"); // تفاعل عند حدوث خطأ
        await conn.sendMessage(m.chat, { 
            text: decorate(`خطأ: ${error.message || error}`) 
        }, { quoted: m });
    }
};

facebookHandler.help = ['فيسبوك <رابط>']
facebookHandler.command = ['فيسبوك', 'فيس', 'الفيسبوك']
facebookHandler.tags = ['downloader']

export default facebookHandler;