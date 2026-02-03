// plugins/level-ken-fixed.js
import { canLevelUp, xpRange } from "../lib/levelling.js";

const DEFAULT_AVATAR = "https://files.catbox.moe/mlfg20.jpg"; // صورة افتراضية
const LEVEL_UP_IMAGE = DEFAULT_AVATAR; // نفس الصورة عند الترقية

async function getProfilePic(conn, jid) {
  try {
    const url = await conn.profilePictureUrl(jid, "image");
    return url || DEFAULT_AVATAR;
  } catch {
    return DEFAULT_AVATAR;
  }
}

const handler = async (m, { conn }) => {
  try {
    const user = global?.db?.data?.users?.[m.sender];
    if (!user) {
      await conn.sendMessage(
        m.chat,
        { text: "❌ لم أجد بياناتك في سجلات البوت. حاول التفاعل أولاً." },
        { quoted: m }
      );
      return;
    }

    let { exp = 0, level = 0, role = "🩸 تابع الظلام", money = 0 } = user;

    // احسب الـ XP المطلوب
    const range = xpRange(level, global.multiplier);
    const xpForLevel = range.xp ?? Math.max(0, (range.max ?? 0) - (range.min ?? 0));
    const max = range.max ?? (xpForLevel + (range.min ?? 0));
    const remainingXP = Math.max(0, max - exp);

    const pp = await getProfilePic(conn, m.sender);
    const name = await conn.getName(m.sender);

    // زخرفة ملف شخصي مع إيموجيات مناسبة
    const profileMessage = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🌟 الـملـف الـشخصـي ✨↞*
  *┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇الـاسم: @${m.sender.split("@")[0]} ↞*
*⎆┇🎖️ المستوى: ${level} ↞*
*⎆┇👑 الرتبة: ${role} ↞*
*⎆┇💰 الرصيد: ${money} ↞*
*⎆┇📈 الخبرة: ${exp}/${xpForLevel} ↞*
*⎆┇🌀 المتبقي للترقية: ${remainingXP} ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
> استمر في التفاعل للوصول لمستوى أعلى! 🏆
`.trim();

    // إذا ما ارتقى
    if (!canLevelUp(level, exp, global.multiplier)) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: pp },
          caption: profileMessage,
          mentions: [m.sender],
        },
        { quoted: m }
      );
      return;
    }

    // عملية الترقية
    let before = level;
    while (canLevelUp(level, exp, global.multiplier)) level++;
    user.level = level;

    try {
      if (global.db && typeof global.db.write === "function") {
        global.db.write();
      }
    } catch (e) {
      console.warn("⚠️ لم يتم الحفظ التلقائي:", e);
    }

    const nextRange = xpRange(level + 1, global.multiplier);
    const nextMax = nextRange.max ?? 0;
    const remainingPoints = Math.max(0, nextMax - exp);

    const levelUpMessage = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🎊 مبروك @${m.sender.split("@")[0]}! ↞*
*⎆┇⬆️ من المستوى: ${before} ↞*
*⎆┇⭐ إلى المستوى: ${user.level} ↞*
*⎆┇📈 المتبقي للترقية التالية: ${remainingPoints} ↞*
*⎆┇👑 الرتبة: ${role} ↞*
*┇💰 الرصيد: ${money}*   *╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
> واصل التقدم، لقد أصبحت أقوى! 💪
`.trim();

    await conn.sendMessage(
      m.chat,
      {
        image: { url: LEVEL_UP_IMAGE },
        caption: levelUpMessage,
        mentions: [m.sender],
      },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        text: `🎉 ${name} لقد ارتقيت +${user.level - before} مستوى! 🌟`,
        mentions: [m.sender],
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("خطأ في أمر الرانك:", err);
    await conn.sendMessage(
      m.chat,
      { text: "❌ حدث خطأ داخلي أثناء تنفيذ الأمر." },
      { quoted: m }
    );
  }
};

handler.help = ["رانك", "lvl", "لفل", "level"];
handler.tags = ["xp"];
handler.command = ["رانك", "lvl", "لفل", "level", "رانكي"];

export default handler;