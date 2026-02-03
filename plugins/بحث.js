import { getIPInfo } from '../plugins/سكراب-ip.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const decorate = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇▸ ${msg}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

    if (!text) {
        await m.reply(decorate(`المرجو تقديم IP بعد الأمر على سبيل المثال ⎆\n*${usedPrefix + command} 52.87.44.246*`));
        return;
    }

    try {
        // ⏳ تفاعل أثناء البحث
        await m.react("⏳");

        const ipInfo = await getIPInfo(text);

        if (!ipInfo) throw "لا يمكن الحصول على معلومات لهذا الـ IP.";

        // ✅ تفاعل النجاح
        await m.react("✅");

        const ipDetails = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ᖇYᘔO ᗷOT ▸ معلومات الـ IP*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

*「 الآي بي 」* ↲﹝ ${ipInfo.ip}﹞💗
*「 المدينة 」* ↲﹝ ${ipInfo.city}﹞🪄
*「 المنطقة 」* ↲﹝ ${ipInfo.region}﹞😍
*「 البلد 」* ↲﹝ ${ipInfo.country}﹞⏳
*「 الموقع 」* ↲﹝ ${ipInfo.loc}﹞🎉
*「 المنظمة 」* ↲﹝ ${ipInfo.org}﹞♟️
*「 الرمز البريدي 」* ↲﹝ ${ipInfo.postal}﹞🔥
*「 المنطقة الزمنية 」* ↲﹝ ${ipInfo.timezone}﹞⏰
*「 الاحداثيات 」* ↲﹝ ${ipInfo.loc}﹞📡
`;

        await m.reply(ipDetails);

    } catch (error) {
        // ❌ تفاعل الخطأ
        await m.react("❌");
        await m.reply(decorate(`حدث خطأ أثناء البحث: ${error.message || error}`));
    }
};

handler.help = ['اوبيتو'];
handler.tags = ['اوبيتو'];
handler.command = /^(ip|بحث)$/i;
handler.premium = true;
handler.limit = true;

export default handler;