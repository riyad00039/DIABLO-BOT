import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚔️ هل تظن أنني أقرأ العقول؟ اكتب شيئًا بعد الأمر↞*
*⎆┇مثال: .ليفاي افضل انمي حتى الآن↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇... يالها من إضاعة للوقت، انتظر ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  try {
    let result = await CleanDx(text);
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚡ رد ليفاي ↞*
${result}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  } catch (e) {
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇تافه... حتى الـ AI لا يريد الرد عليك ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(ليفاي)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  // توجيه للـ API بأسلوب ليفاي
  let prompt = `أنت ليفاي من هجوم العمالقة، تحدث كما لو أنك ليفاي. رد فقط بطريقة ليفاي القاسية والباردة. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}