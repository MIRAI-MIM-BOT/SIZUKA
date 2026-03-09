const axios = require("axios");

const mahmud = [
        "baby",
        "bby",
        "babu",
        "bbu",
        "jan",
        "bot",
        "জান",
        "জানু",
        "বেবি",
        "বট",
        "Bot"
       ];

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "hinata",
                aliases: ["baby", "bby", "bbu", "jan", "janu", "Bot", "bot"],
                version: "1.8",
                author: "MahMUD",
                countDown: 2,
                role: 0,
                description: {
                        bn: "হিনাতা এআই এর সাথে চ্যাট করুন এবং তাকে নতুন কিছু শেখান",
                        en: "Chat with Hinata AI and teach her new things",
                        vi: "Trò chuyện with Hinata AI and teach her new things"
                },
                category: "chat",
                guide: {
                        bn: '   {pn} [মেসেজ] - চ্যাট করতে\n   {pn} teach [প্রশ্ন] - [উত্তর] - শেখাতে\n   {pn} msg [প্রশ্ন] - উত্তর খুঁজতে\n   {pn} edit [প্রশ্ন] - [নতুন উত্তর] - এডিট করতে\n   {pn} remove [প্রশ্ন] - [ইনডেক্স] - ডিলিট করতে\n   {pn} list/list all - টিচার লিস্ট দেখতে',
                        en: '   {pn} [msg] - to chat\n   {pn} teach [q] - [a] - to teach\n   {pn} msg [q] - search reply\n   {pn} edit [q] - [new_a] - to edit\n   {pn} remove [q] - [index] - to remove\n   {pn} list/list all - to see teachers',
                        vi: '   {pn} [tn] - để trò chuyện\n   {pn} teach [h] - [tl] - để dạy\n   {pn} msg [h] - tìm kiếm câu trả lời\n   {pn} edit [h] - [tl_mới] - để sửa\n   {pn} remove [h] - [số] - để xóa\n   {pn} list/list all - để xem danh sách'
                }
        },

        langs: {
                bn: {
                        noInput: "বলো বেবি😘",
                        teachUsage: "❌ | সঠিক নিয়ম: teach [প্রশ্ন] - [উত্তর]",
                        teachSuccess: "✅ উত্তর যুক্ত হয়েছে: \"%1\" -> \"%2\"\n• টিচার: %3\n• মোট ডাটা: %4",
                        removeUsage: "❌ | সঠিক নিয়ম: remove [প্রশ্ন] - [ইনডেক্স]",
                        editUsage: "❌ | সঠিক নিয়ম: edit [প্রশ্ন] - [নতুন উত্তর]",
                        editSuccess: "✅ সফলভাবে এডিট করা হয়েছে!\n• প্রশ্ন: \"%1\"\n• নতুন উত্তর: \"%2\"",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Format: teach [question] - [answer]",
                        teachSuccess: "✅ Reply added: \"%1\" -> \"%2\"\n• Teacher: %3\n• Total: %4",
                        removeUsage: "❌ | Format: remove [question] - [index]",
                        editUsage: "❌ | Format: edit [question] - [new answer]",
                        editSuccess: "✅ Successfully edited!\n• Q: \"%1\"\n• New A: \"%2\"",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Định dạng: teach [câu hỏi] - [câu trả lời]",
                        teachSuccess: "✅ Đã thêm câu trả lời: \"%1\" -> \"%2\"\n• Giáo viên: %3\n• Tổng số: %4",
                        removeUsage: "❌ | Định dạng: remove [câu hỏi] - [số]",
                        editUsage: "❌ | Định dạng: edit [câu hỏi] - [câu trả lời mới]",
                        editSuccess: "✅ Đã sửa thành công!\n• H: \"%1\"\n• TL mới: \"%2\"",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, usersData, getLang, commandName }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) return api.sendMessage("Unauthorized author change.", event.threadID);

                const uid = event.senderID;
                if (!args[0]) return api.sendMessage(getLang("noInput"), event.threadID, (err, info) => {
                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                }, event.messageID);

                try {
                        const baseUrl = await baseApiUrl();
                        const action = args[0].toLowerCase();

                        if (action === "teach") {
                                const input = args.slice(1).join(" ");
                                const [trigger, ...responsesArr] = input.split(" - ");
                                const responses = responsesArr.join(" - ");
                                if (!trigger || !responses) return api.sendMessage(getLang("teachUsage"), event.threadID, event.messageID);
                                const res = await axios.post(`${baseUrl}/api/jan/teach`, { trigger, responses, userID: uid });
                                const name = await usersData.getName(uid);
                                return api.sendMessage(getLang("teachSuccess", trigger, responses, name, res.data.count), event.threadID, event.messageID);
                        }

                        if (action === "edit") {
                                const input = args.slice(1).join(" ");
                                const [oldTrigger, ...newArr] = input.split(" - ");
                                const newResponse = newArr.join(" - ");
                                if (!oldTrigger || !newResponse) return api.sendMessage(getLang("editUsage"), event.threadID, event.messageID);
                                await axios.put(`${baseUrl}/api/jan/edit`, { oldTrigger, newResponse });
                                return api.sendMessage(getLang("editSuccess", oldTrigger, newResponse), event.threadID, event.messageID);
                        }

                        if (action === "remove") {
                                const input = args.slice(1).join(" ");
                                const [trigger, index] = input.split(" - ");
                                if (!trigger || !index || isNaN(index)) return api.sendMessage(getLang("removeUsage"), event.threadID, event.messageID);
                                const res = await axios.delete(`${baseUrl}/api/jan/remove`, { data: { trigger, index: parseInt(index) } });
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        if (action === "msg") {
                                const searchTrigger = args.slice(1).join(" ");
                                if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID);
                                try {
                                        const response = await axios.get(`${baseUrl}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
                                        return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
                                } catch (error) {
                                        const errorMessage = error.response?.data?.error || error.message || "error";
                                        return api.sendMessage(errorMessage, event.threadID, event.messageID);
                                }
                        }

                        if (action === "list") {
                                const endpoint = args[1] === "all" ? "/list/all" : "/list";
                                const res = await axios.get(`${baseUrl}/api/jan${endpoint}`);
                                if (args[1] === "all") {
                                        let message = "👑 List of Hinata Teachers:\n\n";
                                        const data = Object.entries(res.data.data).sort((a, b) => b[1] - a[1]).slice(0, 50);
                                        for (let i = 0; i < data.length; i++) {
                                                const [uID, count] = data[i];
                                                const name = await usersData.getName(uID) || "User";
                                                message += `${i + 1}. ${name}: ${count}\n`;
                                        }
                                        return api.sendMessage(message, event.threadID, event.messageID);
                                }
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: args.join(" "), style: 3, attachments: event.attachments || [] });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                        }, event.messageID);

                } catch (err) {
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        },

        onReply: async function ({ api, event, commandName }) {
                try {
                        const baseUrl = await baseApiUrl();
                        const res = await axios.post(`${baseUrl}/api/hinata`, { 
                                text: event.body?.toLowerCase() || "hi", 
                                style: 3, 
                                attachments: event.attachments || [] 
                        });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                        }, event.messageID);
                } catch (err) { console.error(err); }
        },

        onChat: async function ({ api, event, commandName }) {
                const message = event.body?.toLowerCase() || "";
                if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
                        api.setMessageReaction("🕊️", event.messageID, () => {}, true);
                        const randomReplies = [
                                "𝗕𝗮𝗯𝘆 𝗞𝗵𝘂𝗱𝗮 𝗟𝗮𝗴𝗰𝗵𝗲🥺",
                                "𝗛𝗼𝗽 𝗕𝗲𝗱𝗮😾,𝗕𝗼𝘀𝘀 বল 𝗕𝗼𝘀𝘀😼",
                                "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",                      
                                "𝗡𝗮𝘄 𝗔𝗺𝗮𝗿 𝗕𝗼𝘀𝘀 𝗞 𝗠𝗲𝗮𝘀𝘀𝗮𝗴𝗲 𝗗𝗮𝘂 👉https://www.facebook.com/DEVIL.FARHAN.420",
                                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
                                "এটায় দেখার বাকি সিলো_🙂🙂🙂",
                                "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
                                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
                                "বেশি 𝗕𝗯𝘆 𝗕𝗲𝗯𝘆 করলে 𝗟𝗲𝗮𝘃𝗲 নিবো কিন্তু 😒😒",
                                "__বেশি বেবি বললে কামুর দিমু 🤭🤭",
                                "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
                                "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
                                "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
                                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, 𓆩𝐅𝐀𝐑𝐇𝐀𝐍𓆪,𓆩𝐅𝐀𝐑𝐇𝐀𝐍𓆪 ও তো করতে পারো😑?",
                                "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
                                "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
                                "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
                                "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                                "খাওয়া দাওয়া করসো 🙄",
                                "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
                                "আরে আমি মজা করার 𝗠𝗼𝗼𝗱 এ নাই😒",
                                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
                                "আরে Bolo আমার জান, কেমন আসো? 😚",
                                "একটা 𝗕𝗙 খুঁজে দাও 😿",
                                "𝗢𝗶 𝗠𝗮𝗺𝗮 𝗔𝗿 𝗗𝗮𝗸𝗶𝘀 𝗡𝗮 𝗣𝗶𝗹𝗶𝘇 😿",
                                "𝗔𝗺𝗮𝗿 𝗝𝗮𝗻𝘂 𝗟𝗮𝗴𝗯𝗲 𝗧𝘂𝗺𝗶 𝗞𝗶 𝗦𝗶𝗻𝗴𝗲𝗹 𝗔𝗰𝗵𝗼?",
                                "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
                                "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
                                "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
                                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
                                "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
                                "বলো কি করতে পারি তোমার জন্য 😚",
                                "কথা দেও আমাকে পটাবা...!! 😌",
                                "বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
                                "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
                                "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
                                "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
                                "আজকে আমার mন ভালো নেই 🙉",
                                "আমি হাজারো মশার 𝗖𝗿𝘂𝘀𝗵😓",
                                "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
                                "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
                                "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"
                                "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻","আমি এখন বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻","আমাকে না ডেকে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে একটা জি এফ দাও-😽🫶🌺","ঝাং থুমালে আইলাপিউ পেপি-💝😽","উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈","জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂","আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧","ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦","চুনা ও চুনা আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭","স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻","জান হাঙ্গা করবা-🙊😝🌻","জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽","ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼","আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর  জন্য দোয়া করবেন-💝💚🌺🌻","- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/DEVIL.FARHAN.420","জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽","জান বাল ফালাইবা-🙂🥱🙆‍♂","-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦","oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂","-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে দান করেন-🥱🐰🍒","-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧","-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে-🐸😾🔪","-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧","-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸","তাকাই আছো কেন চুমু দিবা-🙄🐸😘","আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇","-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗","কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻","দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧","-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻","-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻","-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 ধরতে পারছে না-🐸🥲","-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️","—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗","—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️","-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜","সুন্দর মাইয়া মানেই-🥱আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗","এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂","-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸","হুদাই আমারে  শয়তানে লারে-😝😑☹️","-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸","-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦","-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧","-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱","-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋","-ইস কেউ যদি বলতো-🙂-আমার শুধু  তোমাকেই লাগবে-💜🌸","-ওই বেডি তোমার বাসায় না আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে জানে মারার কি দরকার-🙄🤧","-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅","-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧","কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦","-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর মনটা ছাড়া-🥴😑😏","-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵","-আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸","বেশি Bot Bot করলে leave নিবো কিন্তু😒😒 " , "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺 " , "আমি আবাল দের সাতে কথা বলি না,ok😒" , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈" , "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , "বার বার ডাকলে মাথা গরম হয় কিন্তু😑", "হা বলো😒,কি করতে পারি😐😑?" , "এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬","মেয়ে হলে বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে প্রেম করো🙈??. " ,  "আরে Bolo আমার জান ,কেমন আসো?😚 " , "Bot বলে অসম্মান করচ্ছিছ,😰😿" , "Hop bedi😾,Boss বল boss😼" , "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , "Bot না , জানু বল জানু 😘 " , "বার বার Disturb করেছিস কোনো😾,আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর এর সাথে ব্যাস্ত আসি😋" , "আমি গরীব এর সাথে কথা বলি না😼😼" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 " , "আরে আমি মজা করার mood এ নাই😒" , "হা জানু , এইদিক এ আসো কিস দেই🤭 😘" , "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , "আমাকে ডেকো না,আমি ব্যাস্ত আসি" , "কি হলো ,মিস টিস করচ্ছিস নাকি🤣" , "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , "কালকে দেখা করিস তো একটু 😈" , "হা বলো, শুনছি আমি 😏" , "আর কত বার ডাকবি ,শুনছি তো" , "বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে Ummmmha দে 😒" , "বলো কি করতে পারি তোমার জন্য" , "আমি তো অন্ধ কিছু দেখি না🐸 😎" , "Bot না জানু,বল 😌" , "বলো জানু 🌚" , "তোর কি চোখে পড়ে না আমি বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে ব্যাস্ত আসি😒" , "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰","- শখের নারী  বিছানায় মু'তে..!🙃🥴","-𝐈'𝐝 -তে সব 𝐖𝐨𝐰 𝐖𝐨𝐰 বুইড়া বেডি-🐸💦","🥛-🍍👈 -লে খাহ্..!😒🥺","- অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒","~আমি মারা গেলে..!🙂 ~অনেক মানুষ বিরক্ত হওয়া থেকে বেঁচে  যাবে..!😅💔","🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔","~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀","- কারেন্ট একদম বেডি'গো মতো- 🤧 -খালি ঢং করে আসে আবার চলে যায়-😤😾🔪","- সানিলিওন  আফারে ধর্ষনের হুমকি দিয়ে আসলাম - 🤗 -আর 🫵তুমি য়ামারে খেয়ে দিবা সেই ভয় দেখাও ননসেন বেডি..!🥱😼","- দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে সন্দেহ করে.!🐸","- আমার থেকে ভালো অনেক পাবা-🙂 -কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀","- পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔👈","- তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🤣👈","- থাপ্পড় চিনোস থাপ্পড়- 👋👋😡 -চিন্তা করিস না তরে মারমু না-🤗 -বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 আমারে মারছে - 🥱 - উফফ সেই স্বাদ..!🥵🤤💦","- অবহেলা করিস না-😑😪 - যখন নিজেকে বদলে ফেলবো -😌 - তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔","- বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕🥺","-৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমাকে প্রোপস করুন-🤗😂👈","-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧","•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺","- যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴- তুই কি যানিস সেই আইডিটাও আমি চালাইরে.!🙂"  
                        ];
                    
                        const msgParts = message.trim().split(/\s+/);
                        if (msgParts.length === 1 && event.attachments.length === 0) {
                                const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                                return api.sendMessage(reply, event.threadID, (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                }, event.messageID);
                        } else {
                                let userText = message;
                                for (const p of mahmud) { if (message.startsWith(p)) { userText = message.substring(p.length).trim(); break; } }
                                try {
                                        const baseUrl = await baseApiUrl();
                                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: userText, style: 3, attachments: event.attachments });
                                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                        }, event.messageID);
                                } catch (e) { console.error(e); }
                        }
                }
        }
};
