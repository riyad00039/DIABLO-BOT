/*
كود انشاء مواقع بذكاء الاصطناعي احترافي
https://whatsapp.com/channel/0029Vb6dsyP3rZZgNJUD2F1A
by obito
*/

import fetch from 'node-fetch';
import fs from 'fs';


const OBITO_DATA = "./data_site.json";


let userData = {};
try {
    if (fs.existsSync(OBITO_DATA)) {
        const data = fs.readFileSync(OBITO_DATA, 'utf8');
        userData = JSON.parse(data);
    }
} catch (error) {
    console.error('Error loading data:', error);
}


const saveData = () => {
    try {
        fs.writeFileSync(OBITO_DATA, JSON.stringify(userData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving data:', error);
    }
};


const getUserSites = (userId) => {
    return userData[userId] || [];
};


const addUserSite = (userId, siteData) => {
    if (!userData[userId]) {
        userData[userId] = [];
    }
    
    const siteNumber = userData[userId].length + 1;
    const site = {
        number: siteNumber,
        name: siteData.name,
        category: siteData.category,
        description: siteData.description,
        url: siteData.url,
        createdAt: new Date().toISOString()
    };
    
    userData[userId].push(site);
    saveData();
    return siteNumber;
};


const deleteUserSite = (userId, siteNumber) => {
    if (!userData[userId]) return false;
    
    const initialLength = userData[userId].length;
    userData[userId] = userData[userId].filter(site => site.number !== parseInt(siteNumber));
    
    if (userData[userId].length < initialLength) {

        userData[userId].forEach((site, index) => {
            site.number = index + 1;
        });
        saveData();
        return true;
    }
    return false;
};


const HEADERS = {
    'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    'Accept-Encoding': "gzip, deflate, br, zstd",
    'Content-Type': "application/json",
    'language': "en",
    'sec-ch-ua-platform': "\"Android\"",
    'sec-ch-ua': "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    'sec-ch-ua-mobile': "?1",
    'origin': "https://www.renderforest.com",
    'sec-fetch-site': "same-site",
    'sec-fetch-mode': "cors",
    'sec-fetch-dest': "empty",
    'referer': "https://www.renderforest.com/website-maker/new/lang/start-creation/ai?industry=%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%B9%D9%86%20%D9%86%D9%81%D8%B3%D9%8A",
    'accept-language': "ar-IQ,ar;q=0.9,en-US;q=0.8,en;q=0.7",
    'priority': "u=1, i",
};


const generateSite = async (category, description, name) => {
    const url = "https://site-maker-api.renderforest.com/api/v1/sites/ai/generate";
    const payload = JSON.stringify({
        "category": category,
        "description": description,
        "name": name,
        "style": "professional"
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: HEADERS,
        body: payload
    });

    if (!response.ok) {
        throw new Error(`فشل في إنشاء الموقع: ${response.status}`);
    }

    const data = await response.json();
    const tempId = data.data.tempId;
    return `https://www.renderforest.com/website-maker/new/lang/preview-project/ai-preset/${tempId}`;
};


const userStates = {};

const handler = async (m, { conn, usedPrefix, command, text }) => {
    const userId = m.sender;
    
    try {

        if (!text) {
            const menuMessage = `🌐 *منشئ المواقع المجاني*\n\n` +
                `اختر من القائمة:\n\n` +
                `📋 *الأوامر المتاحة:*\n` +
                `• ${usedPrefix}موقع إنشاء - لإنشاء موقع جديد\n` +
                `• ${usedPrefix}موقع عرض - لعرض مواقعك\n` +
                `• ${usedPrefix}موقع حذف <رقم> - لحذف موقع\n\n` +
                `🎯 *مثال:*\n` +
                `• ${usedPrefix}موقع متجر إلكتروني|أبيع منتجات إلكترونية|متجري\n` +
                `• ${usedPrefix}موقع حذف 1`;

            const buttons = [
                { buttonId: `${usedPrefix}موقع إنشاء`, buttonText: { displayText: 'إنشاء موقع 🌐' }, type: 1 },
                { buttonId: `${usedPrefix}موقع عرض`, buttonText: { displayText: 'مواقعي 📂' }, type: 1 },
                { buttonId: `${usedPrefix}موقع حذف`, buttonText: { displayText: 'حذف موقع 🗑' }, type: 1 }
            ];

            await conn.sendMessage(m.chat, {
                text: menuMessage,
                footer: "By obito mr dev",
                buttons: buttons,
                headerType: 1
            }, { quoted: m });
            return;
        }


        if (text === 'إنشاء') {
            userStates[userId] = { step: 'awaiting_category' };
            await conn.sendMessage(m.chat, {
                text: `📝 *مرحلة إنشاء الموقع*\n\nأدخل تخصص الموقع:\n(مثال: متجر إلكتروني، مدونة، شركة، إلخ)`
            }, { quoted: m });
            return;
        }


        if (text === 'عرض') {
            const sites = getUserSites(userId);
            if (sites.length === 0) {
                await conn.reply(m.chat, '❌ ليس لديك أي مواقع محفوظة حالياً.', m);
                return;
            }

            let sitesMessage = `📂 *مواقعك المحفوظة*\n\n`;
            sites.forEach(site => {
                sitesMessage += `🔢 *رقم الموقع:* ${site.number}\n`;
                sitesMessage += `🏷️ *اسم الموقع:* ${site.name}\n`;
                sitesMessage += `📊 *التخصص:* ${site.category}\n`;
                sitesMessage += `🔗 *الرابط:* ${site.url}\n`;
                sitesMessage += `📝 *المعلومات:* ${site.description}\n`;
                sitesMessage += `⏰ *تاريخ الإنشاء:* ${new Date(site.createdAt).toLocaleDateString('ar-EG')}\n`;
                sitesMessage += `━━━━━━━━━━━━━━━━━━━━\n\n`;
            });

            await conn.reply(m.chat, sitesMessage, m);
            return;
        }


        if (text.startsWith('حذف')) {
            const parts = text.split(' ');
            if (parts.length < 2) {
                const sites = getUserSites(userId);
                if (sites.length === 0) {
                    await conn.reply(m.chat, '❌ ليس لديك أي مواقع لحذفها.', m);
                    return;
                }

                let deleteMessage = `🗑 *حذف موقع*\n\nأرسل:\n${usedPrefix}موقع حذف <رقم الموقع>\n\n`;
                deleteMessage += `📋 *مواقعك:*\n`;
                sites.forEach(site => {
                    deleteMessage += `${site.number}. ${site.name}\n`;
                });

                await conn.reply(m.chat, deleteMessage, m);
                return;
            }

            const siteNumber = parts[1];
            const deleted = deleteUserSite(userId, siteNumber);
            if (deleted) {
                await conn.reply(m.chat, `✅ تم حذف الموقع رقم ${siteNumber} بنجاح.`, m);
            } else {
                await conn.reply(m.chat, `❌ لم يتم العثور على موقع برقم ${siteNumber}.`, m);
            }
            return;
        }


        if (text.includes('|')) {
            const parts = text.split('|');
            if (parts.length < 3) {
                await conn.reply(m.chat, 
                    `❌ *صيغة خاطئة*\n\n` +
                    `استخدم:\n` +
                    `${usedPrefix}موقع التخصص|المعلومات|الاسم\n\n` +
                    `📝 *مثال:*\n` +
                    `${usedPrefix}موقع متجر إلكتروني|أبيع منتجات إلكترونية|متجري`,
                    m
                );
                return;
            }

            const [category, description, name] = parts.map(part => part.trim());
            
            await conn.reply(m.chat, '🔄 جاري إنشاء الموقع... الرجاء الانتظار.', m);

            try {
                const url = await generateSite(category, description, name);
                const siteNumber = addUserSite(userId, {
                    name: name,
                    category: category,
                    description: description,
                    url: url
                });

                const successMessage = `✅ *تم إنشاء الموقع بنجاح!*\n\n` +
                    `🔢 *رقم الموقع:* ${siteNumber}\n` +
                    `🏷️ *اسم الموقع:* ${name}\n` +
                    `📊 *التخصص:* ${category}\n` +
                    `📝 *المعلومات:* ${description}\n` +
                    `🔗 *رابط الموقع:* ${url}\n\n` +
                    `⎆ *لحذف الموقع استخدم:*\n` +
                    `${usedPrefix}موقع حذف ${siteNumber}`;

                await conn.reply(m.chat, successMessage, m);
            } catch (error) {
                console.error('Create site error:', error);
                await conn.reply(m.chat, 
                    `❌ *حدث خطأ أثناء إنشاء الموقع*\n\n` +
                    `${error.message}\n\n` +
                    `⚠️ حاول مرة أخرى أو غير البيانات.`,
                    m
                );
            }
            return;
        }


        const userState = userStates[userId];
        if (userState) {
            if (userState.step === 'awaiting_category') {
                userState.category = text;
                userState.step = 'awaiting_description';
                await conn.sendMessage(m.chat, {
                    text: `📝 *المرحلة الثانية*\n\nأدخل معلومات عن الموقع:\n(مثال: أبيع منتجات إلكترونية، مدونة شخصية، إلخ)`
                }, { quoted: m });
                return;
            }

            if (userState.step === 'awaiting_description') {
                userState.description = text;
                userState.step = 'awaiting_name';
                await conn.sendMessage(m.chat, {
                    text: `📝 *المرحلة الثالثة*\n\nأدخل اسم الموقع:\n(مثال: متجري، مدونتي، شركتي، إلخ)`
                }, { quoted: m });
                return;
            }

            if (userState.step === 'awaiting_name') {
                userState.name = text;
                
                await conn.reply(m.chat, '🔄 جاري إنشاء الموقع... الرجاء الانتظار.', m);

                try {
                    const url = await generateSite(userState.category, userState.description, userState.name);
                    const siteNumber = addUserSite(userId, {
                        name: userState.name,
                        category: userState.category,
                        description: userState.description,
                        url: url
                    });

                    const successMessage = `✅ *تم إنشاء الموقع بنجاح!*\n\n` +
                        `🔢 *رقم الموقع:* ${siteNumber}\n` +
                        `🏷️ *اسم الموقع:* ${userState.name}\n` +
                        `📊 *التخصص:* ${userState.category}\n` +
                        `📝 *المعلومات:* ${userState.description}\n` +
                        `🔗 *رابط الموقع:* ${url}\n\n` +
                        `⎆ *لحذف الموقع استخدم:*\n` +
                        `${usedPrefix}موقع حذف ${siteNumber}`;

                    await conn.reply(m.chat, successMessage, m);
                } catch (error) {
                    console.error('Create site error:', error);
                    await conn.reply(m.chat, 
                        `❌ *حدث خطأ أثناء إنشاء الموقع*\n\n` +
                        `${error.message}`,
                        m
                    );
                }
                
                delete userStates[userId];
                return;
            }
        }


        await conn.reply(m.chat, 
            `❌ *أمر غير معروف*\n\n` +
            `استخدم ${usedPrefix}موقع للمساعدة.`,
            m
        );

    } catch (error) {
        console.error('Handler error:', error);
        await conn.reply(m.chat, 
            `❌ *حدث خطأ*\n\n${error.message}`,
            m
        );
    }
};


handler.help = ["obito"];
handler.tags = ["obito"];
handler.command = /^(موقع)$/i;

export default handler;