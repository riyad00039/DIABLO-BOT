import fetch from "node-fetch";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { FormData, Blob } from "formdata-node";
import { generateWAMessageFromContent, prepareWAMessageMedia } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime)
      return conn.reply(
        m.chat,
        `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ أرسل صورة أو فيديو أو صوت لتحويله إلى رابط ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
        m
      );

    // 🔹 إرسال ريأكت انتظار
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    let media = await q.download();
    if (!media || media.length === 0)
      return conn.reply(m.chat, `❌ فشل تحميل الملف، أعد المحاولة.`, m);

    let link = await catbox(media);
    if (!link || link.includes("error"))
      return conn.reply(m.chat, `❌ فشل رفع الملف إلى الخادم.`, m);

    let caption = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇ ᖇYᘔO ᗷOT ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*

*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇📂 الـمـلـف مرفوع بنجاح ↞*
*⎆┇🔗 الـرابـط:* ${link}
*⎆┇📊 الـحـجـم:* ${formatBytes(media.length)}
*⎆┇⏳ الانتهاء:* لا ينتهي
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`.trim();

    // إعداد الصورة دون إرسالها
    const preparedMedia = await prepareWAMessageMedia({ image: media }, { upload: conn.waUploadToServer });

    // بناء الرسالة التفاعلية
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "💠 *رفع ناجح عبر* 💠",
                hasMediaAttachment: true,
                imageMessage: preparedMedia.imageMessage,
              },
              body: { text: caption },
              footer: { text: "⎆ انسخ الرابط أو شاركه الآن ⎆" },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                      display_text: "⎆ نسخ الرابط ⎆",
                      copy_code: link,
                    }),
                  },
                ],
              },
            },
          },
        },
      },
      { userJid: conn.user.id }
    );

    // 🔹 إرسال الرسالة التفاعلية
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    // 🔹 تغيير الريأكت إلى ✅ بعد النجاح
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ حدث خطأ أثناء الرفع، حاول مجددًا.`, m);
    // 🔹 في حال الخطأ ضع ريأكت ❌
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.command = handler.help = ["رابط"];
handler.tags = ["tools"];
handler.diamond = true;
export default handler;

// 🧩 وظائف مساعدة
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  try {
    const type = await fileTypeFromBuffer(content);
    if (!type) throw new Error("تعذر تحديد نوع الملف");

    const { ext, mime } = type;
    const blob = new Blob([content], { type: mime });
    const formData = new FormData();
    const random = crypto.randomBytes(5).toString("hex");

    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, `${random}.${ext}`);

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error("رفع فشل:", err);
    return "error";
  }
}