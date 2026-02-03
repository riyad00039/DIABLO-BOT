import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    if (command.startsWith('اجاب_')) {
        let id = m.chat;
        let obito = conn.obito[id];

        if (!obito) {
            return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ لا تـوجـد لـعـبـة نـشـطـة الآن ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ اخـتـيـار غـيـر صـالـح ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
        }

        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇✅ إجـابـة صـحـيـحـة ↞*
*⎆┇💰 الجـائـزة ⇇『500xp』↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇❌ إجـابـة خـاطـئـة ↞*
*⎆┇🔄 مـحـاولـات مـتـبـقـيـة ⇇『${obito.attempts}』↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
            } else {
                await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⛔ انـتـهـت مـحـاولـاتـك ↞*
*⎆┇✅ الإجـابـة الـصـحـيـحـة ⇇『${obito.correctAnswer}』↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
    } else {
        try {
            conn.obito = conn.obito || {};
            let id = m.chat;

            if (conn.obito[id]) {
                return conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ لـديـك لـعـبـة قـيـد الـتـشـغـيـل ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/ze819/game/master/src/game.js/luffy1.json');
            const obitoData = await response.json();

            const obitoItem = obitoData[Math.floor(Math.random() * obitoData.length)];
            const { img, name } = obitoItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = obitoData[Math.floor(Math.random() * obitoData.length)].name;
                if (!options.includes(randomItem)) options.push(randomItem);
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🚩 لـعـبـة "اعـرف عـلـم الـدلـة" ↞*
*⎆┇⏳ الـوقـت ⇇『60 ثانـيـة』↞*
*⎆┇💰 الجـائـزة ⇇『500xp』↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
                    `.trim(),
                },
                footer: { text: 'ᖇYᘔO ᗷOT' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'اخـتـر الإجـابـة الـصـحـيـحـة مـن الأسـفـل ✅',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `⌖${index + 1}⌖⇇『${option}』`,
                            id: `.اجاب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.obito[id] = {
                correctAnswer: name,
                options,
                attempts: 2,
                timer: setTimeout(async () => {
                    if (conn.obito[id]) {
                        await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⛔ انـتـهـى الـوقـت ↞*
*⎆┇✅ الإجـابـة الـصـحـيـحـة ⇇『${name}』↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
                        `.trim(), m);
                        delete conn.obito[id];
                    }
                }, timeout)
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ حـدث خـطـأ فـي إرـسـال الـرسـالـة ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, m);
        }
    }
};

handler.help = ['علم'];
handler.tags = ['game'];
handler.command = /^(علم|اعلام|اجاب_\d+)$/i;

export default handler;