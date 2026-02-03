/* 💣 لعبة القنبلة - نسخة مدمجة ومُحسّنة (تتعامل مع كتابة/أزرار/قبل) */

let handler = async (m, { conn, command, text }) => {
  try {
    conn.bomb = conn.bomb || {};
    const id = m.chat;
    const timeout = 180000; // 3 دقائق
    // اختر reward عند كل عملية فتح (يمكن تغييره لثابت عند بدء اللعبة إن أردت)
    const reward = randomInt(100, 80000);
    const users = global.db?.data?.users?.[m.sender] || { exp: 0 };

    // ======= استخراج الإدخال من كل المصادر الممكنة =======
    // (1) قيمة text عند استدعاء الدالة من before
    // (2) نص الرسالة العادية m.text
    // (3) زر مخصّص: m.buttonId أو m.selectedButtonId
    // (4) بعض إصدارات bailey تضعها داخل m.msg.message.buttonsResponseMessage.selectedButtonId
    const inputFromParams = (text ?? '').toString().trim();
    const inputFromText = (m.text ?? '').toString().trim();
    const inputFromButton =
      (m.buttonId ?? m.selectedButtonId ?? (m.msg?.message?.buttonsResponseMessage?.selectedButtonId)) ?? '';
    // اختيار أول قيمة موجودة بترتيب أفضلية
    const rawInput = inputFromParams || inputFromButton || inputFromText;
    const body = rawInput.toString().trim();

    // ======= أمر الاستسلام (بكتابة أو زر إن كان الزر له هذا المعرف) =======
    if (/^(استسلام|انسحب|surr?ender|0)$/i.test(body)) {
      if (!conn.bomb[id]) return conn.reply?.(m.chat, '🚫 لا توجد لعبة لتستسلم منها.', m);
      clearTimeout(conn.bomb[id].timeout);
      delete conn.bomb[id];
      return conn.reply?.(m.chat, '🚩 لقد استسلمت! انتهت اللعبة.', m);
    }

    // ======= بدء اللعبة بأمر (مثال: .متفجرات) =======
    if (command === 'متفجرات') {
      if (conn.bomb[id]) return m.reply?.('⚠️ هناك لعبة قيد التشغيل بالفعل!');
      const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
      const numbers = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
      const grid = bom.map((v, i) => ({ emot: v, number: numbers[i], position: i + 1, state: false }));

      let teks = renderBombGrid(grid);
      teks += `\n🎯 أرسل رقمًا (1-9) أو استخدم الأزرار لفتح الصناديق.\n⏱ الوقت المحدد: ${timeout / 60000} دقيقة.\nاكتب *استسلام* لإنهاء اللعبة.`;

      // 🛑 انتبه: نحفظ مفتاح الرسالة (key) للرسالة التي تحتوي على الأزرار
      const msg = await conn.sendMessage(m.chat, {
        text: teks,
        buttons: grid.map(g => ({
          buttonId: g.position.toString(), // نرسل رقم الزر كـ id (1..9)
          buttonText: { displayText: g.number },
          type: 1
        })),
        headerType: 1
      });
      // يتم حفظ مفتاح الرسالة (key) في Baileys داخل msg.key
      const msgKey = msg.key; 

      conn.bomb[id] = {
        msgKey, // حفظ مفتاح الرسالة
        grid,
        timeout: setTimeout(() => {
          const bombBox = grid.find(v => v.emot === '💥');
          conn.reply?.(m.chat, `⏰ انتهى الوقت! القنبلة كانت في الصندوق ${bombBox.number}`, msg);
          delete conn.bomb[id];
        }, timeout)
      };
      return;
    }

    // ======= في حال لم توجد جلسة شغالة لا نفعل شيء =======
    if (!conn.bomb[id]) return;

    // ======= التعامل مع اختيار رقم (سواء كتابة أو زر) =======
    // استخراج الرقم فقط من body — يسمح بكتابة "1" أو "1️⃣" أو الضغط على زر الذي أرسل "1"
    const pos = parseInt(body.replace(/\D/g, ''), 10); // سيأخذ الأرقام فقط
    if (!pos || pos < 1 || pos > 9) return;

    const bombData = conn.bomb[id].grid.find(v => v.position === pos);
    if (!bombData) return;
    if (bombData.state) return conn.reply?.(m.chat, `🚩 الصندوق ${bombData.number} مفتوح مسبقًا.`, m);

    // ضع حالة الصندوق مفتوح الآن
    bombData.state = true;
    const arr = conn.bomb[id].grid;
    let teks = renderBombGrid(arr);
    let gameEnded = false;

    // 💥 حالة القنبلة
    if (bombData.emot === '💥') {
      teks += `\n💥 لقد فتحت القنبلة!\n❌ تم خصم ${formatNumber(reward)} نقطة.`;
      users.exp = Math.max((users.exp || 0) - reward, 0);
      clearTimeout(conn.bomb[id].timeout);
      delete conn.bomb[id];
      gameEnded = true;
    } else {
      // صندوق آمن
      const safeOpened = arr.filter(v => v.state && v.emot !== '💥').length;
      teks += `\n✅ صندوق آمن! +${formatNumber(reward)} نقاط.`;
      users.exp = (users.exp || 0) + reward;

      // إن فُتحت 8 صناديق آمنة => فوز
      if (safeOpened >= 8) {
        teks += `\n🎉 فزت باللعبة! لم تُفتح القنبلة 💣.\n🏆 مكافأة إضافية +${formatNumber(reward)} نقاط.`;
        users.exp += reward; // مكافأة إضافية
        clearTimeout(conn.bomb[id].timeout);
        delete conn.bomb[id];
        gameEnded = true;
      }
    }

    // ======= إعادة إرسال حالة الشبكة مع أزرار الصناديق المتبقية =======
    let buttonsRemaining = [];
    if (!gameEnded) {
        buttonsRemaining = (arr.filter(v => !v.state)).map(v => ({
            buttonId: v.position.toString(),
            buttonText: { displayText: v.number },
            type: 1
        }));
    }
    
    // إذا انتهت اللعبة (فوز/خسارة)، نقوم بإظهار موقع القنبلة وتحديث الرسالة.
    if (gameEnded) {
        // إظهار موقع القنبلة في الشبكة (في حالة الفوز أو الخسارة)
        const finalArr = arr.map(v => ({ ...v, state: true })); // افتح كل الصناديق للعرض النهائي
        teks = renderBombGrid(finalArr) + teks; // إضافة الشبكة النهائية إلى الرسالة
    }

    // 🌟 التعديل الرئيسي: استخدام sendMessage مع edit لتحرير الرسالة الأصلية (طريقة Baileys الصحيحة)
    await conn.sendMessage(m.chat, {
      text: teks,
      buttons: buttonsRemaining.length ? buttonsRemaining : [], // لو خلصت الأزرار نرسل بدون أزرار
      headerType: 1,
      edit: conn.bomb[id]?.msgKey // استخدام edit لتحرير الرسالة الأصلية
    });
    
    // في حالة انتهاء اللعبة، يجب التأكد من حذف الجلسة إن لم يكن قد تم حذفها بالفعل
    if (gameEnded && conn.bomb[id]) {
        delete conn.bomb[id];
    }

  } catch (err) {
    console.error('Bomb game error =>', err);
    try { m.reply?.('❌ حدث خطأ أثناء اللعبة.'); } catch(e){ /* ignore */ }
  }
};

handler.help = ['متفجرات'];
handler.tags = ['game'];
handler.command = /^(متفجرات)$/i;

export default handler;

/* ===== before =====
   نستخدم before لالتقاط الرسائل الرقمية (1-9) قبل أن تذهب لأي هاندلر آخر
   ونمرر النص كـ text إلى handler حتى تتم معالجته بنفس الدالة.
*/
export async function before(m, { conn }) {
  try {
    // إذا لا توجد جلسة فلا نحتاج للمعالجة
    if (!conn.bomb) return;
    const id = m.chat;
    if (!conn.bomb[id]) return;

    // الحصول على أي مدخل مشابه للضغط على زر أو كتابة رقم
    const inputFromText = (m.text ?? '').toString().trim();
    const inputFromButton =
      (m.buttonId ?? m.selectedButtonId ?? (m.msg?.message?.buttonsResponseMessage?.selectedButtonId)) ?? '';
    const body = inputFromButton || inputFromText;

    // فحص ما إذا كان المدخل رقماً، أو نص استسلام
    if (/^[1-9]$/.test(body) || /^[1-9]\uFE0F\u20E3$/.test(inputFromText) || /\d/.test(body) || /^(استسلام|انسحب|surr?ender|0)$/i.test(body)) {
      // مرّر body عبر text لكي يلتقطه handler
      await handler(m, { conn, text: body });
      return true; // منع بقية الهاندلرز إن لزم
    }
  } catch (e) {
    console.error('before(bomb) error =>', e);
  }
  return false;
}

/* 🎲 دوال مساعدة */
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function formatNumber(n) { return (n || 0).toLocaleString('ar-EG'); }

function renderBombGrid(arr) {
  let grid = `乂  *B O M B*\n\n`;
  grid += arr.slice(0, 3).map(v => (v.state ? v.emot : v.number)).join(' ') + '\n';
  grid += arr.slice(3, 6).map(v => (v.state ? v.emot : v.number)).join(' ') + '\n';
  grid += arr.slice(6).map(v => (v.state ? v.emot : v.number)).join(' ') + '\n';
  return grid;
}