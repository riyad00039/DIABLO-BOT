import fetch from "node-fetch";
import { FormData, Blob } from "formdata-node";

const IMGBB_API_KEY = "bf0977b12b3fd31bf4cdb5f8ec4d0f11";
const EDIT_API = "https://api.obito-sar.store/api/ai/Studio-Ghibli";

// رفع الصورة إلى ImgBB
async function uploadToImgBB(buffer) {
  const blob = new Blob([buffer], { type: "image/jpeg" });
  const form = new FormData();
  form.append("image", blob, "uploaded-image.jpg");

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: form,
  });

  const result = await res.json();
  if (result.success) return result.data.url;
  else throw new Error("❌ فشل رفع الصورة إلى ImgBB");
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || "";

  if (!mime) return conn.reply(m.chat, `⚠️ أرسل أو رد على صورة مع كتابة *${usedPrefix + command}*`, m);
  if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, `⚠️ هذا ليس بصيغة صورة صالحة (JPEG أو PNG).`, m);

  try {
    await conn.reply(m.chat, "⏱️ *جارٍ تحويل الصورة...*", m);

    const imgData = await q.download();
    const imageUrl = await uploadToImgBB(imgData);

    const editResponse = `${EDIT_API}?image=${encodeURIComponent(imageUrl)}`;

    await conn.sendMessage(m.chat, {
      image: { url: editResponse },
      caption: `✅ *تم تعديل الصورة بنجاح*\n\nᖇYᘔO ᗷOT ✨`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❌ خطأ: ${error.message}`, m);
  }
};

handler.tags = ["ai"];
handler.command = ["لكرتون"];
handler.help = ["لكرتون"];
handler.limit = true;

export default handler;