import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, {
      text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚀 أدخـل وصـفـاً للصـورة الـتـي تـريـد تـخـيـلـهـا ↞*
*⎆┇💬 يـجـب أن يـكـون بـالـلـغـة EN ↞*
*⎆┇📌 مـثـال: ↞*
> .رسم A luxurious boy anime character
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
      quoted: m
    });
    return;
  }

  await m.react('🎨');
  await conn.sendMessage(m.chat, {
    text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🎨 جـارٍ مـعـالـجـة طـلـبـك... انـتـظـر قـلـيـلاً 💫 ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
  });

  try {
    const response = await fetch(`https://image-generator-xvi.vercel.app/api/generate-image?text=${encodeURIComponent(text)}`);

    if (!response.ok) throw new Error(`⚠️ فشل في جلب الصورة (الكود: ${response.status})`);
    if (!response.headers.get("content-type")?.startsWith("image")) throw new Error("⚠️ الاستجابة ليست صورة!");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await m.react('✅');
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇✨ تـم إنـشـاء الـصـورة بـنـجـاح 🎨 ↞*
*⎆┇💭 وصـفـك:* ${text} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
    });

  } catch (error) {
    console.error(error);
    await m.react('❌');
    await conn.sendMessage(m.chat, {
      text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ حـدث خـطـأ أثـنـاء الـتـنـفـيـذ ↞*
*⎆┇💢 الـتـفـاصـيـل:* ${error.message} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`,
      quoted: m
    });
  }
};

handler.tags = ['X V I I T A C H I'];
handler.help = ['تخيل'];
handler.command = ['ارسم', 'imagine', 'رسم'];

export default handler;