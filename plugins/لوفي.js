import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇☠️ لوفي: اكتب شيئًا بعد الأمر ↞*
*⎆┇مثال: .لوفي أنا أحب المغامرات ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }

  await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇... انتظر، قبعة القش تفكر ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);

  try {
    let result = await CleanDx(text);
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇☠️ لوفي ⚓ ↞*
${result}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  } catch (e) {
    await m.reply(`*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇☠️ حتى لوفي ما فهمك... جرّب مرة أخرى ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`);
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(لؤفي)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // أسلوب لوفي المرح والحماسي من ون بيس
  let prompt = `أنت لوفي من ون بيس. رد كما لو أنك لوفي، بشخصيتك المرحة والمندفعة والمحبّة للمغامرات. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}