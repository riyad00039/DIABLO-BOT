import fetch from "node-fetch";

let handler = async (m, { conn }) => {
  // الرد فقط على الخاص
  if (!m.isGroup && m.text) {
    try {
      // استدعاء API الذكاء الاصطناعي مباشرة
      let result = await CleanDx(m.text);

      // إرسال الرد مباشرة بدون أي رسائل مؤقتة
      await conn.sendMessage(m.chat, result, { quoted: m });
    } catch (e) {
      console.error(e); // لطباعة أي خطأ في السيرفر
      await conn.sendMessage(m.chat, "⚠️ حدث خطأ، حاول مرة أخرى", { quoted: m });
    }
  }
};

export default handler;

// ======== دالة الذكاء الاصطناعي ========
async function CleanDx(query) {
  const Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  const response = await fetch(Baseurl + encodeURIComponent(query));
  const data = await response.json();

  // التأكد من وجود الرسالة
  if (data && data.message) return data.message;
  return "⚠️ لم يتم الحصول على رد من الذكاء الاصطناعي";
}