import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn }) => {
    conn.tebakbendera = conn.tebakbendera || {};
    let id = m.chat;

    if (id in conn.tebakbendera) {
        conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⚠️ لا يُمكِن بـدء سؤال جـديـد ↞*
*⎆┇⏳ هـنـاك سـؤال قـائـم ↞*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, conn.tebakbendera[id][0]);
        throw false;
    }

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/miku.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇🧩 فكك الكلمة ↞*
➤ ${json.response.split('').join(' ')}
*╟┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇👤 اللاعب ↞* @${m.sender.split('@')[0]}
*⎆┇الـوقـت⏳↞* ${(timeout / 1000).toFixed(0)} ثـانـيـة
*⎆┇الـجـائـزة💰↞* ${poin} نُقـطـة
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`.trim();

    conn.tebakbendera[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.tebakbendera[id]) {
                await conn.reply(m.chat, `
*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
*⎆┇⛔ انـتـهـى الـوقـت ↞*
*⎆┇✅ الإجـابـة الـصـحـيـحـة ↞* ${json.response}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*
`, conn.tebakbendera[id][0]);
                delete conn.tebakbendera[id];
            }
        }, timeout)
    ];
};

handler.help = ['فكك'];
handler.tags = ['game'];
handler.command = /^(فكك)$/i;

export default handler;