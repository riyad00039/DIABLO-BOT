import { toDataURL } from 'qrcode'

let handler = async (m, { conn, text, command }) => {
  const deco = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇ ${msg} ↞*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`
  const commandText = command.includes('code') || command.includes('كود') ? 'كـود' : 'رمـز QR'

  if (!text) return m.reply(deco(`🧾 طـريـقـة الاسـتـخـدام:\n\nأرسـل الأمـر بهـذا الشكـل:\n*.${commandText} <النـص>*\n\n⎆ مثـال:\n*.${commandText} مرحبـًا*`))

  const qrImage = await toDataURL(text.slice(0, 2048), { scale: 8 })

  await conn.sendFile(
    m.chat,
    qrImage,
    'qrcode.png',
    deco(`✅ تـم إنشـاء ${commandText} بـنـجـاح ✅`),
    m
  )
}

handler.help = ['', 'code', 'كود'].map(v => 'qr' + v)
handler.tags = ['tools']
handler.command = /^(qr|qrcode|كود)$/i
handler.register = true

export default handler