import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

let handler = async (m, { conn }) => {
  const decorate = (msg) => `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*\n*⎆┇▸ ${msg}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⟐*`;

  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q)?.mimetype || ''

    if (!/video|audio/.test(mime)) {
      return conn.sendMessage(m.chat, {
        text: decorate("✳️ قم بالرد على فيديو أو صوت لتحويله لصوت")
      }, { quoted: m })
    }

    let media = await q.download?.()
    if (!media) throw new Error("فشل تحميل الوسائط")

    // خزنه مؤقتًا
    let tmpIn = path.join(os.tmpdir(), `input_${Date.now()}.mp4`)
    let tmpOut = path.join(os.tmpdir(), `output_${Date.now()}.mp3`)
    fs.writeFileSync(tmpIn, media)

    // ffmpeg process
    await new Promise((resolve, reject) => {
      let ff = spawn('ffmpeg', ['-y', '-i', tmpIn, '-vn', '-acodec', 'libmp3lame', tmpOut])
      ff.on('close', code => {
        if (code !== 0) reject(new Error(`ffmpeg exited with code ${code}`))
        else resolve()
      })
    })

    let audio = fs.readFileSync(tmpOut)

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mpeg',
      fileName: 'converted.mp3',
      ptt: false,
      caption: decorate("تم تحويل الفيديو/الصوت إلى MP3 بنجاح ✅")
    }, { quoted: m })

    // نظف الملفات
    fs.unlinkSync(tmpIn)
    fs.unlinkSync(tmpOut)

  } catch (e) {
    console.error('Error in tomp3 command:', e)
    await conn.sendMessage(m.chat, {
      text: decorate(`⚠️ حدث خطأ: ${e.message}`)
    }, { quoted: m })
  }
}

handler.help = ['لصوت', 'tomp3', 'لفويس']
handler.tags = ['tools']
handler.command = /^(لصوت|tomp3|لفويس)$/i

export default handler