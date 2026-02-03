import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚀 جبتي: أدخل نصًا بعد الأمر لاستخدام الذكاء الاصطناعي ↞*
*⎆┇مثال: .جبتي افضل انمي حتى الآن ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇... جاري التفكير 🤖 ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  try {
    let result = await CleanDx(text);
    let translatedResult = await translateToArabic(result);
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇💬 جبتي ↞*
${translatedResult}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  } catch (e) {
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ وقعت مشكلة، حاول مرة أخرى ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(جبتي)$/i;
export default handler;

// ======== الدوال ========
async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  let response = await fetch(Baseurl + encodeURIComponent(your_qus));
  let data = await response.json();

  return data.message;
}

async function translateToArabic(text) {
  const response = await fetch(
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=" +
      encodeURIComponent(text)
  );
  const result = await response.json();
  return result[0][0][0];
}

function generateRandomString(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function formatTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}