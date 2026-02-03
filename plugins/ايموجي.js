import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn }) => {
    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    if (id in conn.tekateki) {
        conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ سـؤال قـائـم بـالـفـعـل ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
> ⏳ أكمِل الإجابة أولاً!`, conn.tekateki[id][0]);
        throw false;
    }

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/miku4.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🎭 سـؤال الإيـمـوجـي ↞*
➤ ${json.question}
*╟┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇👤 الـلاعـب ↞* @${m.sender.split('@')[0]}
*⎆┇الـوقـت⏳↞* ${(timeout / 1000).toFixed(0)} ثـانـيـة
*⎆┇الـجـائـزة💰↞* ${poin} نُقـطـة
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⛔ انـتـهـى الـوقـت ↞*
*⎆┇✅ الإجـابـة الـصـحـيـحـة ↞* ${json.response}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = ['ايموجي'];
handler.tags = ['game'];
handler.command = /^(ايموجي)$/i;

export default handler;