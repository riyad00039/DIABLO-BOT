/*
• ᖇYᘔO ᗷOT | نظام إحصائيات الرسائل الجماعية
• مميز مع تفاعل، وترتيب حسب النشاط
• بواسطة Felix مع زخرفة
*/

let handler = async (m, { conn, participants, groupMetadata, command }) => {
    if (!global.groupData) global.groupData = {};
    const chatId = m.chat;

    if (!global.groupData[chatId]) global.groupData[chatId] = {};
    const groupUsers = global.groupData[chatId];

    // إضافة المستخدمين الجدد
    if (!groupUsers[m.sender]) groupUsers[m.sender] = { messagesSent: 0 };
    participants.forEach(p => {
        if (!groupUsers[p.id]) groupUsers[p.id] = { messagesSent: 0 };
    });

    // صورة افتراضية للبروفايل
    let profilePicture;
    try {
        profilePicture = await conn.profilePictureUrl(m.sender, 'image');
    } catch {
        profilePicture = 'https://files.catbox.moe/ipu0b5.jpg';
    }

    const groupName = groupMetadata.subject;

    const topDecor = `╭─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╮`;
    const bottomDecor = `╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪⃘⃪𐇽۪۫۬֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯`;

    if (command === 'رسائلي' || command === 'رسايلي') {
        const messagesSent = groupUsers[m.sender].messagesSent;
        const message = `
${topDecor}
🎯 *إحصائيات رسائلك*🎯

📌 *المجموعة:* ${groupName}
👤 *المستخدم:* @${m.sender.split('@')[0]}
✉️ *عدد الرسائل:* ${messagesSent} رسالة

🔹 حافظ على نشاطك! كل رسالة تُحسب.

${bottomDecor}
        `.trim();

        await conn.sendMessage(m.chat, {
            image: { url: profilePicture },
            caption: message,
            mentions: [m.sender]
        });
        await m.react('✅');
    } else if (command === 'اجمالي') {
        const sortedUsers = Object.entries(groupUsers).sort((a, b) => b[1].messagesSent - a[1].messagesSent);
        const totalMessages = sortedUsers.reduce((sum, u) => sum + u[1].messagesSent, 0);
        const totalMembers = participants.length;

        let resultMessage = `
${topDecor}

📊 *إحصائيات المجموعة* 📊

📌 *المجموعة:* ${groupName}
🔹 *عدد الأعضاء:* ${totalMembers}
🔹 *إجمالي الرسائل:* ${totalMessages} رسالة
        `.trim();

        if (sortedUsers.length > 0) {
            const king = sortedUsers[0];
            resultMessage += `
🎖️ *ملك التفاعل!* 🎖️
⎆ @${king[0].split('@')[0]} - ${king[1].messagesSent} رسالة ⎆
            `.trim();
        }

        resultMessage += `

📋 *تفاصيل الرسائل حسب الأعضاء:* 📋
━━━━━━━━━━━━━━━━━━━━
`;

        sortedUsers.forEach(([user, data], i) => {
            resultMessage += `${i + 1}. @${user.split('@')[0]} - ${data.messagesSent} رسالة\n━━━━━━━━━━━━━━━━━━━━\n`;
        });

        resultMessage += `\n${bottomDecor}`;

        await conn.sendMessage(m.chat, {
            image: { url: profilePicture },
            caption: resultMessage,
            mentions: participants.map(p => p.id)
        });
        await m.react('✅');
    }
};

// تحديث إحصائيات الرسائل في كل رسالة
handler.all = async (m) => {
    if (!m.text) return;
    const chatId = m.chat;
    if (!global.groupData) global.groupData = {};
    if (!global.groupData[chatId]) global.groupData[chatId] = {};

    const groupUsers = global.groupData[chatId];
    if (!groupUsers[m.sender]) groupUsers[m.sender] = { messagesSent: 0 };
    groupUsers[m.sender].messagesSent += 1;
};

handler.help = ['رسائلي', 'رسايلي', 'اجمالي'];
handler.tags = ['main', 'stats'];
handler.command = ['رسائلي', 'رسايلي', 'اجمالي'];
handler.register = true;

export default handler;