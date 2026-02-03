// الكود مقدم من سبيد 3 إكس زد - تم التعريب بواسطة الذكاء الاصطناعي

import {Maker} from 'imagemaker.js';

const handler = async (m, {conn, args, command, usedPrefix}) => {
  const response = args.join(' ').split('|');
  if (!args[0]) throw '*[❗] يرجى إدخال نص*';
  
  if (command == 'شعار_قلب') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/text-heart-flashlight-188.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_الكريسماس') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res2 = await new Maker().Ephoto360('https://en.ephoto360.com/christmas-effect-by-name-376.html', [response[0]]);
      await conn.sendFile(m.chat, res2.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_زوجين') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/sunlight-shadow-text-204.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_جلتش') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_حزين') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/write-text-on-wet-glass-online-589.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_جيمنج') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/make-team-logo-online-free-432.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_وحيد') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_دراغون_بول') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_نيون') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_قطتي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_فتاة_جيمر') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-cute-girl-gamer-mascot-logo-online-687.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_ناروتو') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_مستقبلي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_سحاب') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/cloud-text-effect-139.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_ملاك') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/angel-wing-effect-329.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_سماء') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-a-cloud-text-effect-in-the-sky-618.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_جرافيتي_ثلاثي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/text-graffiti-3d-208.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_ماتريكس') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/matrix-text-effect-154.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_رعب') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/blood-writing-text-online-77.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_أجنحة') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/the-effect-of-galaxy-angel-wings-289.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_جيش') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/free-gaming-logo-maker-for-fps-game-team-546.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_ببجي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/pubg-logo-maker-cute-character-online-617.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_ببجي_بناتي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/pubg-mascot-logo-maker-for-an-esports-team-612.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_لول') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/make-your-own-league-of-legends-wallpaper-full-hd-442.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_امونج_اس') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-a-cover-image-for-the-game-among-us-online-762.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'فيديو_شعار_ببجي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/lightning-pubg-video-logo-maker-online-615.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'فيديو_شعار_نمر') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-digital-tiger-logo-video-effect-723.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'فيديو_مقدمة') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/free-logo-intro-video-maker-online-558.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'فيديو_شعار_جيمنج') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-elegant-rotation-logo-online-586.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'شعار_محارب') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-project-yasuo-logo-384.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'غلاف_لاعب') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-the-cover-game-playerunknown-s-battlegrounds-401.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'غلاف_فري_فاير') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-free-fire-facebook-cover-online-567.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'غلاف_ببجي') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-facebook-game-pubg-cover-photo-407.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
  
  if (command == 'غلاف_كونتر') {
    try {
      await conn.reply(m.chat, '*جاري إنشاء الشعار، انتظر لحظة... 🕑*', m);
      const res = await new Maker().Ephoto360('https://en.ephoto360.com/create-youtube-banner-game-cs-go-online-403.html', [response[0]]);
      await conn.sendFile(m.chat, res.imageUrl, 'error.jpg', null, m);
    } catch {
      await conn.reply(m.chat, '*خطأ، يرجى المحاولة مرة أخرى 🔖*', m);
    }
  }
}

handler.help = [
  'شعار_قلب', 'شعار_الكريسماس', 'شعار_زوجين', 'شعار_جلتش', 'شعار_حزين', 
  'شعار_جيمنج', 'شعار_وحيد', 'شعار_دراغون_بول', 'شعار_نيون', 'شعار_قطتي',
  'شعار_فتاة_جيمر', 'شعار_ناروتو', 'شعار_مستقبلي', 'شعار_سحاب', 'شعار_ملاك',
  'شعار_سماء', 'شعار_جرافيتي_ثلاثي', 'شعار_ماتريكس', 'شعار_رعب', 'شعار_أجنحة',
  'شعار_جيش', 'شعار_ببجي', 'شعار_ببجي_بناتي', 'شعار_لول', 'شعار_امونج_اس',
  'فيديو_شعار_ببجي', 'فيديو_شعار_نمر', 'فيديو_مقدمة', 'فيديو_شعار_جيمنج',
  'شعار_محارب', 'غلاف_لاعب', 'غلاف_فري_فاير', 'غلاف_ببجي', 'غلاف_كونتر'
]

handler.tags = ['شعارات']
handler.command = [
  'شعار_قلب', 'شعار_الكريسماس', 'شعار_زوجين', 'شعار_جلتش', 'شعار_حزين', 
  'شعار_جيمنج', 'شعار_وحيد', 'شعار_دراغون_بول', 'شعار_نيون', 'شعار_قطتي',
  'شعار_فتاة_جيمر', 'شعار_ناروتو', 'شعار_مستقبلي', 'شعار_سحاب', 'شعار_ملاك',
  'شعار_سماء', 'شعار_جرافيتي_ثلاثي', 'شعار_ماتريكس', 'شعار_رعب', 'شعار_أجنحة',
  'شعار_جيش', 'شعار_ببجي', 'شعار_ببجي_بناتي', 'شعار_لول', 'شعار_امونج_اس',
  'فيديو_شعار_ببجي', 'فيديو_شعار_نمر', 'فيديو_مقدمة', 'فيديو_شعار_جيمنج',
  'شعار_محارب', 'غلاف_لاعب', 'غلاف_فري_فاير', 'غلاف_ببجي', 'غلاف_كونتر'
]

export default handler;