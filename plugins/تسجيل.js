/* 💜 ᖇYᘔO ᗷOT 💜 - نظام التسجيل المزخرف */

import { randomInt } from 'crypto'

let Reg = /\|?(.*?)(?:[.|] *?(\d+))?$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
    try {
        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/cruad5.jpg')
        let user = global.db.data.users[m.sender]
        
        if (user.registered) return m.reply(`
╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣
┃ ➟ 🎗 *أنت مسجل بالفعل، حبيبي~*
┃ ➟ ✨ لإلغاء التسجيل أرسل: ${usedPrefix}unreg <PIN>
╰━━━━━━━━━━━━⬣
`)

        let jid = m.sender
        let name = text?.trim() || await conn.getName(jid) || ''
        let match = name.match(Reg)
        name = (match && match[1].trim()) || name
        if (/^\+?\d+$/.test(name)) name = ''
        let age = match[2] ? parseInt(match[2]) : null

        if (!age) {
            let lists = Array.from({ length: 41 }, (_, i) => {
                let usia = i + 10
                return {
                    title: `العمر ${usia} سنة`,
                    description: `🎗 اضغط لاختيار العمر ${usia}`,
                    id: `${usedPrefix + command} ${name}.${usia}`
                }
            })
            await conn.sendMessage(m.chat, {
                image: { url: pp },
                caption: `
╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣
┃ ➟ 🫧 *الرجاء اختيار عمرك من القائمة أدناه~*
┃ ➟ 📌 *اختر العمر الصحيح حسب عمرك الحقيقي، حبيبي~*
╰━━━━━━━━━━━━⬣
`.trim(),
                footer: '💜 ᖇYᘔO ᗷOT 💜',
                interactiveButtons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: '🎗 اختر عمرك',
                            sections: [
                                { title: '🔖 قائمة الأعمار المتاحة', rows: lists }
                            ]
                        })
                    }
                ],
                hasMediaAttachment: false
            }, { quoted: m })
            return
        }

        if (!name) return m.reply('📝 *لا يمكن أن يكون الاسم فارغًا~ (استخدم الحروف)*')
        if (!age) return m.reply('🎗 *العمر لا يمكن أن يكون فارغًا~ (استخدم الأرقام)*')
        if (age > 50) return m.reply('🧓 *آه! شخص كبير جدًا~ (。-`ω´-)*')
        if (age < 10) return m.reply('👶 *أنت صغير جدًا، لا يمكن اللعب بعد~*')
        if (name.length > 50) return m.reply('📛 *الاسم طويل جدًا، الحد الأقصى 50 حرف فقط~*')

        await m.reply('⏳ جاري معالجة التسجيل...')

        user.name = name.trim()
        user.age = age
        user.regTime = + new Date
        user.commandLimit = user.commandLimit === 1000 ? user.commandLimit : 1000
        user.registered = true
        user.pin = randomInt(100000, 999999)

        // رسالة التسجيل المزخرفة 💜
        let capUser = `
╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣
┃ 👤 ╎ الاسم: ${user.name}
┃ 📆 ╎ العمر: ${user.age} سنة
┃ 🔐 ╎ PIN الخاص بك: ${user.pin}
╰━━━━━━━━━━━━⬣

╭━━〔📋 مـعـلـومـات〕━━⬣
┃ 📌 ╎ تم تسجيلك بنجاح داخل النظام!
┃ 📝 ╎ احتفظ بالـPIN لتستخدمه لاحقًا.
┃ 💬 ╎ يمكنك الآن استخدام أوامر البوت بحرية.
╰━━━━━━━━━━━━⬣

💟 ╎ واتس للتواصل:  
👉 https://wa.me/${m.sender.split('@')[0]}
`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: capUser,
            footer: '💜 ᖇYᘔO ᗷOT 💜',
            interactiveButtons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📖 القائمة',
                        id: '.اوامر'
                    })
                }
            ],
            hasMediaAttachment: false
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply(`
╭━━〔💜 ᖇYᘔO ᗷOT 💜〕━━⬣
┃ ❌ حدث خطأ أثناء التسجيل.
┃ 💬 حاول مجددًا لاحقًا.
╰━━━━━━━━━━━━⬣
`)
    }
}

handler.help = ['تسجيل', 'register', 'reg']
handler.tags = ['xp']
handler.command = /^(تسجيل|verify|reg(ister)?)$/i

export default handler