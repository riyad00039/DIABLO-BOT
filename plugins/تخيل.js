import axios from "axios";
import { generateWAMessageFromContent, prepareWAMessageMedia } from "@whiskeysockets/baileys";

const IMAGE_URL = "https://i.postimg.cc/xCPZnb6B/1761614493417.jpg";
const API_PASSWORD = "t5y6s8o2n*n1a4r9u0t3o";

let handler = async (m, { conn, text = "", usedPrefix = "", command = "" }) => {
  try {
    // ==== واجهة "تخيل" (قائمة الاختيارات) ====
    if (command === "تخيل" && !text) {
      return m.reply(
        `❗️ *خطأ — مفقود الوصف*\n` +
        `لكي نولد محتوى، اكتب مثلًا:\n` +
        `*${usedPrefix}تخيل قطة صغيرة تلعب في الحديقة 🐱*`
      );
    }

    if (command === "تخيل") {
      const desc = text.trim();

      const media = await prepareWAMessageMedia(
        { image: { url: IMAGE_URL } },
        { upload: conn.waUploadToServer }
      );

      const caption = `🎨 *اختر نوع التخيل المطلوب:*\n\n📝 الوصف: ${desc}`;

      // ملاحظة: اجعل id للأزرار بدون مسافات زائدة بعد اسم الأمر لتسهيل التحليل لاحقًا
      const rows = [
        { title: "🖼️ انشاء صورة", id: `${usedPrefix}تخيل-انشاء ${encodeURIComponent(desc)}|img` },
        { title: "🎬 انشاء فيديو", id: `${usedPrefix}تخيل-انشاء ${encodeURIComponent(desc)}|vid` }
      ];

      const msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
                body: { text: caption },
                footer: { text: "💜 ᖇYᘔO ᗷOT 💜" },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "اختر النوع 🎬",
                        sections: [{ title: "خيارات التخيل ⚡", rows }],
                      }),
                    },
                  ],
                },
              },
            },
          },
        },
        { userJid: conn.user.jid, quoted: m }
      );

      return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    // ==== تنفيذ "تخيل-انشاء" ====
    if (command === "تخيل-انشاء") {
      // نص coming from framework قد يحتوي مسافات. نعمل trim ونحاول استخراج آخر جزء بعد الفاصل '|'
      let raw = (text || "").trim();

      // بعض البيئات ترسل النص مع البادئة المستخدمة accidental (مث: "/تخيل-انشاء <payload>")
      // لذا نحاول إذا بدا النص يبدأ بمثل usedPrefix أو اسم الأمر أن نزيلها:
      if (raw.startsWith(usedPrefix)) {
        // إزالة أول كلمة (التي قد تكون الأمر الكامل مع البادئة)
        const parts0 = raw.split(" ");
        if (parts0.length > 1 && parts0[0].includes("تخيل-انشاء")) {
          parts0.shift();
          raw = parts0.join(" ").trim();
        }
      }

      // الآن raw متوقع أن يكون مثل: "<encodedDesc>|img" أو "<encodedDesc>|vid"
      const pipeIndex = raw.lastIndexOf("|");
      if (pipeIndex === -1) {
        return m.reply("⚠️ صيغة غير صحيحة. الصيغة المتوقعة: <وصف> | img أو | vid");
      }

      const encodedDesc = raw.slice(0, pipeIndex).trim();
      const model = raw.slice(pipeIndex + 1).trim().toLowerCase();

      if (!encodedDesc || !model) return m.reply("⚠️ حدث خطأ أثناء معالجة البيانات. الرجاء المحاولة مرة أخرى.");

      let desc;
      try {
        desc = decodeURIComponent(encodedDesc);
      } catch (e) {
        // إذا لم يكن مشفراً، استخدم النص كما هو
        desc = encodedDesc;
      }

      if (!["img", "vid", "image", "video"].includes(model)) {
        return m.reply("⚠️ نوع غير مدعوم. استخدم `img` أو `vid`.");
      }

      await m.reply(model.includes("vid") ? "🎬 جاري انشاء الفيديو..." : "🖼️ جاري انشاء الصورة...");

      // ✅ استدعاء API
      const apiUrl = `https://api-tyson-md.vercel.app/api/ai/imagine?prompt=${encodeURIComponent(desc)}&model=${encodeURIComponent(model)}&password=${encodeURIComponent(API_PASSWORD)}`;

      let res;
      try {
        res = await axios.get(apiUrl, { timeout: 20000 });
      } catch (e) {
        console.error("Axios error:", e);
        return m.reply("❌ خطأ في الاتصال بخدمة التوليد. حاول لاحقًا.");
      }

      const data = res?.data;
      // تحقق آمن من وجود رابط
      const resultUrl = data && (data.url || data.result || data.data?.url);

      if (!data) {
        return m.reply("❌ لم يتم تلقي استجابة من الخادم.");
      }

      // اذا الـ API يعيد حالة خطأ ضمن مفتاح status، تحقَّق بأمان
      if (data.status && typeof data.status === "string" && data.status.toLowerCase().includes("خطأ")) {
        return m.reply(`❌ فشل انشاء المحتوى: ${data.status}`);
      }

      if (!resultUrl) {
        console.error("Unexpected API response:", data);
        return m.reply(
          `❌ فشل انشاء ${model.includes("vid") ? "الفيديو" : "الصورة"} — لم يتم إيجاد رابط صالح في استجابة الـ API.`
        );
      }

      // إرسال النتيجة حسب النوع (نرسل كـ video أو image)
      if (model.includes("vid")) {
        await conn.sendMessage(
          m.chat,
          { video: { url: resultUrl }, caption: `🎬 *${desc}*\n✅ تم انشاء الفيديو بواسطة\n💜 ᖇYᘔO ᗷOT 💜` },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(
          m.chat,
          { image: { url: resultUrl }, caption: `🖼️ *${desc}*\n✅ تم انشاء الصورة بواسطة\n💜 ᖇYᘔO ᗷOT 💜` },
          { quoted: m }
        );
      }
    }
  } catch (err) {
    console.error("Imagine Error:", err);
    return m.reply(`❌ حدث خطأ أثناء تنفيذ الأمر:\n${err.message || String(err)}`);
  }
};

handler.command = ["تخيل", "تخيل-انشاء"];
export default handler;