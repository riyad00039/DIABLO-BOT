import axios from 'axios';
const { generateWAMessageContent, proto } = (await import("@whiskeysockets/baileys")).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🔴 لازم تدخل اسم الفنان أو الأغنية!\n🔹 مثال:\n${usedPrefix + command} insane HAZBIN hotel`;

  await conn.sendMessage(m.chat, {
    react: {
      text: "🎶",
      key: m.key
    }
  });

  try {
    let resultados = await spotifyxv(text);
    if (!resultados || resultados.length === 0) throw `⚠️ مع الأسف مش لاقي حاجة تطابق بحثك 😔`;

    const result = resultados[0];
    const trackUrl = result.link;
    const downloadResult = await spotiDown(trackUrl);

    if (!downloadResult.status) {
      return m.reply(`🎶 ${downloadResult.result.error}`);
    }

    const { title, artist, album, duration, image, download, trackId } = downloadResult.result;
    const caption =
      `╮••─๋︩︪──๋︩︪─═⊐‹🎵›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ تم التحميل بنجاح!
── • ◈ • ──
*⌝🎶┊معلومات الأغنية┊🎧⌞* 
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹✨›⊏═┈ ─๋︩︪─ ∙ ∙ ⟐ـ
┤┌─๋︩︪─✦تفاصيل☇─˚᳝᳝𖥻
│┊ ۬.͜ـ🎼˖ ⟨العنوان: ${title}⟩
│┊ ۬.͜ـ🎤˖ ⟨الفنان: ${artist}⟩
│┊ ۬.͜ـ💿˖ ⟨الألبوم: ${album}⟩
│┊ ۬.͜ـ⏱️˖ ⟨المدة: ${duration}⟩
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹🎵›⊏═┈ ─๋︩︪─ ∙ ∙ ⟐`;

    const audioRes = await axios.get(download, { responseType: 'arraybuffer' });

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: 'تم التحميل',
          thumbnailUrl: image,
          mediaUrl: `https://open.spotify.com/track/${trackId}`,
          mediaType: 2,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioRes.data),
      mimetype: 'audio/mp4',
      fileName: `${artist} - ${title}.mp3`,
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.log(e);
    await conn.reply(m.chat, `❗ حصل خطأ أثناء البحث أو التحميل.\nجرب تكتب الاسم بطريقة أوضح.\n\n${usedPrefix + command}`, m);
  }
};

handler.command = /^(سبوتيفاي)$/i;

export default handler;

// ====== دوال مساعدة ======

async function spotifyxv(query) {
  const token = await obtenerTokenSpotify();
  const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return response.data.tracks.items.map(item => ({
    nombre: item.name,
    artistas: item.artists.map(a => a.name),
    album: item.album.name,
    duracion: item.duration_ms,
    link: item.external_urls.spotify
  }));
}

async function obtenerTokenSpotify() {
  const clientId = "cda875b7ec6a4aeea0c8357bfdbab9c2";
  const clientSecret = "c2859b35c5164ff7be4f979e19224dbe";
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': `Basic ${encoded}`
    }
  });

  return response.data.access_token;
}

async function spotiDown(url) {
  const extractId = (input) => {
    const patterns = [
      /spotify\.com\/track\/([a-zA-Z0-9]{22})/,
      /spotify:track:([a-zA-Z0-9]{22})/,
      /^([a-zA-Z0-9]{22})$/
    ];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const trackId = extractId(url);
  if (!trackId) {
    return {
      status: false,
      code: 400,
      result: {
        error: "لم يتم استخراج رابط صحيح من نتيجة البحث"
      }
    };
  }

  const fullUrl = `https://open.spotify.com/track/${trackId}`;

  try {
    const response = await axios.post(
      'https://parsevideoapi.videosolo.com/spotify-api/',
      { format: 'web', url: fullUrl },
      {
        headers: {
          'authority': 'parsevideoapi.videosolo.com',
          'user-agent': 'Postify/1.0.0',
          'referer': 'https://spotidown.online/',
          'origin': 'https://spotidown.online'
        }
      }
    );

    const { status, data } = response.data;

    if (status === "-4") {
      return {
        status: false,
        code: 400,
        result: {
          error: "خطا 400"
        }
      };
    }

    const meta = data?.metadata;
    if (!meta || Object.keys(meta).length === 0) {
      return {
        status: false,
        code: 404,
        result: {
          error: "خطا 404"
        }
      };
    }

    return {
      status: true,
      code: 200,
      result: {
        title: meta.name,
        artist: meta.artist,
        album: meta.album,
        duration: meta.duration,
        image: meta.image,
        download: meta.download,
        trackId
      }
    };
  } catch (error) {
    return {
      status: false,
      code: error.response?.status || 500,
      result: {
        error: "في تحميل الأغنية. حاول لاحقاً."
      }
    };
  }
}