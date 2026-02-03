import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚔️ هل تظن أنني أقرأ العقول؟ اكتب شيئًا بعد الأمر↞*
*⎆┇مثال: .كيلوا افضل انمي حتى الآن↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇... ماذا تريد الآن؟ انتظر لحظة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  try {
    let result = await CleanDx(text);
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚡ رد كيلوا ↞*
${result}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  } catch (e) {
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇أنت مجرد إزعاج... حتى الـ AI لا يرغب في الرد عليك ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(كيلوا)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  // توجيه للـ API بأسلوب كيلوا
  let prompt = `أنت كيلوا من هانتر x هانتر، تحدث كما لو أنك كيلوا. رد فقط بطريقة كيلوا السريعة والساخرة. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}