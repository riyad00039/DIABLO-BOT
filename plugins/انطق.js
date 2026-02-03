import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const baseAPI = "https://api-tyson-md.vercel.app/api/ai/elevenlabs";
  
  const quotedMsg = m.quoted;
  const hasAudio = quotedMsg?.audio || 
                  quotedMsg?.msg?.audioMessage || 
                  quotedMsg?.message?.audioMessage ||
                  m.quoted?.mtype === 'audioMessage';

 
  if (!text && !hasAudio) {
    try {
      let data;
      try {
        const res = await axios.get(baseAPI, { timeout: 10000 });
        data = res.data;
      } catch (err) {
        if (err.response && err.response.data && err.response.data.voices) {
          data = err.response.data;
        } else {
          throw err;
        }
      }

      const voices = data.voices || [];
      if (!voices.length) return m.reply("❌ لا توجد أصوات متاحة حالياً.");

      let msg = `🎙️ *الأمر:* ${usedPrefix + command} [الصوت] [النص]\n\n`;
      msg += `📋 *مثال:*\n${usedPrefix + command} ادم اهلا بيك هنا 🎧\n\n`;
      msg += `🎵 *استخدام جديد:*\nرد على رسالة صوتية واكتب:\n${usedPrefix + command} ادم\n\n`;
      msg += `🎧 *الأصوات المتوفرة:*\n`;
      msg += voices.map((v, i) => `✨ ${i + 1}. ${v}`).join("\n");

      await m.reply(msg);
      return;
    } catch (err) {
      console.error(err);
      return m.reply(`❌ حصل خطأ أثناء جلب قائمة الأصوات.\n📩 التفاصيل: ${err.message}`);
    }
  }

  if (hasAudio) {
    try {
      await m.reply("🔄 جاري معالجة الصوت...");
      
      const voice = text?.trim() || "ادم"; // الصوت الافتراضي
      

      let audioBuffer;
      try {
        audioBuffer = await quotedMsg.download();
      } catch (downloadErr) {
        console.error("خطأ في تحميل الصوت:", downloadErr);
        return m.reply("❌ تعذر تحميل الرسالة الصوتية. تأكد من أنها رسالة صوتية صالحة.");
      }

      if (!audioBuffer || audioBuffer.length === 0) {
        return m.reply("❌ الصوت فارغ أو غير صالح.");
      }

      // استخدام الوظيفة الأصلية للنص إلى كلام مع رسالة مخصصة
      const musicPrompt = `غني هذه الكلمات بنمط موسيقي جميل بصوت ${voice}: [سيتم إضافة الكلمات لاحقاً]`;
      
      const url = `${baseAPI}?prompt=${encodeURIComponent(musicPrompt)}&voice=${encodeURIComponent(voice)}`;
      const { data } = await axios.get(url, { timeout: 15000 });

      if (!data?.url) {
        return m.reply(`❌ حصل خطأ أثناء معالجة الصوت.\n📩 ${data?.message || "بدون تفاصيل"}`);
      }

      const audioMessage = {
        audio: { url: data.url },
        mimetype: "audio/mpeg",
        ptt: false, // ليس PTT للموسيقى
      };

      await conn.sendMessage(m.chat, audioMessage, { quoted: m });
      
    } catch (err) {
      console.error("خطأ في معالجة الصوت:", err);
      
      let errorMsg = `❌ حصل خطأ أثناء معالجة الصوت.`;
      
      if (err.code === 'ECONNABORTED') {
        errorMsg += "\n⏰ انتهت مهلة الاتصال. حاول مرة أخرى.";
      } else if (err.response?.status === 404) {
        errorMsg += "\n🔍 API غير متوفر حالياً.";
      } else if (err.message?.includes('timeout')) {
        errorMsg += "\n⏰ استغرقت العملية وقتاً طويلاً. حاول مرة أخرى.";
      } else {
        errorMsg += `\n📩 التفاصيل: ${err.message}`;
      }
      
      await m.reply(errorMsg);
    }
    return;
  }

  const parts = text.split(" ");
  if (parts.length < 2) {
    return m.reply(`⚠️ اكتب الصوت وبعده الجملة!\n\n📌 مثال:\n${usedPrefix + command} ادم ازيك عامل ايه 🌟\n\n🎵 أو رد على رسالة صوتية واكتب: ${usedPrefix + command} ادم`);
  }

  const voice = parts[0];
  const prompt = parts.slice(1).join(" ");

  try {
    await m.reply("🔄 جاري إنشاء الصوت...");
    
    const url = `${baseAPI}?prompt=${encodeURIComponent(prompt)}&voice=${encodeURIComponent(voice)}`;
    const { data } = await axios.get(url, { timeout: 15000 });

    if (!data?.url) {
      return m.reply(`❌ حصل خطأ أثناء توليد الصوت.\n📩 ${data?.message || "بدون تفاصيل"}`);
    }

    const audioMessage = {
      audio: { url: data.url },
      mimetype: "audio/mpeg",
      ptt: true, // PTT للكلام العادي
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    
  } catch (err) {
    console.error("خطأ في إنشاء الصوت:", err);
    
    let errorMsg = `❌ حصل خطأ أثناء إنشاء الصوت.`;
    
    if (err.code === 'ECONNABORTED') {
      errorMsg += "\n⏰ انتهت مهلة الاتصال. حاول مرة أخرى.";
    } else if (err.response?.status === 404) {
      errorMsg += "\n🔍 API غير متوفر حالياً.";
    } else if (err.message?.includes('timeout')) {
      errorMsg += "\n⏰ استغرقت العملية وقتاً طويلاً. حاول مرة أخرى.";
    } else {
      errorMsg += `\n📩 التفاصيل: ${err.message}`;
    }
    
    await m.reply(errorMsg);
  }
};

handler.command = /^(انطق|نطق|قول)$/i;
handler.help = [
  "انطق [الصوت] [النص] - تحويل النص إلى صوت",
  "انطق [الصوت] - بالرد على رسالة صوتية"
];
handler.tags = ["ai", "tools", "voice"];

export default handler;