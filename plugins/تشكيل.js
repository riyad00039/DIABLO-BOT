// Import { default as handlerFunction } from 'some-module'; // إذا كنت تستخدم نظام وحدات

let handler = async (m, { conn, text, command }) => {
  // 1. التحقق من الأمر
  if (command !== 'تشكيل') return;

  // 2. التحقق من وجود النص
  if (!text) {
    // إذا كان النص فارغًا، نعيد مثال الاستخدام (هذا هو السلوك الذي ربما تعتبره "عدم عمل")
    return m.reply('*مثال:* \n*.تشكيل* 💛');
  }

  // 3. بناء الزخرفة
  // يمكن استخدام قالب نصي متعدد الأسطر (Template Literal) بشكل مباشر
  const decoratedText = `
👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿👇🏿
👉🏿👇🏾👇🏾👇🏾👇🏾👇🏾👇🏾👇🏾👇🏾👈🏿
👉🏿👉🏾👇🏽👇🏽👇🏽👇🏽👇🏽👇🏽👇🏽👈🏾👈🏿
👉🏿👉🏾👉🏽👇🏼👇🏼👇🏼👇🏼👇🏼👈🏽👈🏾👈🏿
👉🏿👉🏾👉🏽👉🏼👇🏻👇🏻👇🏻👈🏼👈🏽👈🏾👈🏿
👉🏿👉🏾👉🏽👉🏼👉🏻 ${text} 👈🏻👈🏼👈🏽👈🏾👈🏿
👉🏿👉🏾👉🏽👉🏼👆🏻👆🏻👆🏻👈🏼👈🏽👈🏾👈🏿
👉🏿👉🏾👉🏽👆🏼👆🏼👆🏼👆🏼👆🏼👈🏽👈🏾👈🏿
👉🏿👉🏾👆🏽👆🏽👆🏽👆🏽👆🏽👆🏽👈🏽👈🏾👈🏿
👉🏿👆🏾👆🏾👆🏾👆🏾👆🏾👆🏾👆🏾👆🏾👆🏾👈🏿
👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿👆🏿
  `.trim(); // استخدام .trim() لإزالة المسافات البيضاء الزائدة في البداية والنهاية.

  // 4. إرسال الرسالة
  await conn.sendMessage(
    m.chat,
    { 
      text: decoratedText, 
      mentions: m.mentionedJid || [] 
    },
    { quoted: m }
  );
};

handler.command = handler.help = ['تشكيل'];
handler.tags = ['fun'];

export default handler;