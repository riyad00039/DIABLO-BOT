const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // مثال واضح إذا ما دخل المستخدم مبلغ
    if (!args[0]) {
      const example = `*[❗️] لازم تكتب مبلغ اللعب (XP)*\n\n*📌 مثال:*\n*${usedPrefix || ''}${command} 100*`;
      return conn.reply(m.chat, example, m);
    }

    if (isNaN(args[0])) {
      const example = `*[⚠️] المبلغ لازم يكون رقم*\n\n*📌 مثال:*\n*${usedPrefix || ''}${command} 100*`;
      return conn.reply(m.chat, example, m);
    }

    const bet = parseInt(args[0]);

    // تأكد من وجود قاعدة البيانات وقيم المستخدم
    global.db = global.db || { data: { users: {} } };
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {
      exp: 0,
      lastslot: 0
    };
    let user = global.db.data.users[m.sender];

    if (bet < 100) {
      return conn.reply(m.chat, '*[❗] الحد الأدنى للعب هو 100 XP*', m);
    }

    if (user.exp < bet) {
      return conn.reply(m.chat, '*[❗] ليس لديك XP كافي للعب!*', m);
    }

    const timeout = 60000; // فترة الانتظار بالميلي ثانية (قابلة للتغيير)
    if (new Date() - (user.lastslot || 0) < timeout) {
      const remain = (user.lastslot + timeout) - Date.now();
      const sec = Math.ceil(remain / 1000);
      return conn.reply(m.chat, `*⏳ انتظر ${sec} ثانية لإعادة اللعب!*`, m);
    }

    const slots = ['🎲', '🎯', '🧩'];
    const a = slots[Math.floor(Math.random() * slots.length)];
    const b = slots[Math.floor(Math.random() * slots.length)];
    const c = slots[Math.floor(Math.random() * slots.length)];

    let resultText = `\x0a🎰 | نتائج حظك | 🎰\n────────\n`;
    resultText += `${a} : ${b} : ${c}\n────────\n`;

    let result;
    if (a === b && b === c) {
      user.exp += bet;
      result = `*🎉 فزت! +${bet} XP*`;
    } else if (a === b || a === c || b === c) {
      user.exp += 10;
      result = `*🔮 حظ متوسط +10 XP*`;
    } else {
      user.exp -= bet;
      result = `*❌ خسرت -${bet} XP*\n*📌 حاول مرة أخرى!*`;
    }

    user.lastslot = Date.now();
    resultText += result;

    return conn.reply(m.chat, resultText, m);
  } catch (err) {
    console.error(err);
    return conn.reply(m.chat, '❌ حصل خطأ غير متوقع. حاول مرة ثانية.', m);
  }
};

handler.help = ['حظ <المبلغ>'];
handler.tags = ['game'];
handler.command = /^حظ$/i;

export default handler;