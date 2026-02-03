import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚜️ ايرين: اكتب شيئًا بعد الأمر ↞*
*⎆┇مثال: .ايرين الحرية فوق كل شيء ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }

  await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇... انتظر، حتى إيرين عنده صبر ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  try {
    let result = await CleanDx(text);
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚜️ ايرين ↞*
${result}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  } catch (e) {
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚜️ حتى إيرين ملّ من سؤالك ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(ايرين)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // أسلوب إيرين الحاد والمتمرد
  let prompt = `أنت إيرين ييغر من أنمي هجوم العمالقة. رد بأسلوبك الحاد، الغاضب، المليء بالإرادة والتمرد. لا تستخدم المجاملات، وقل الحقيقة كما تراها. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}