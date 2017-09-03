const VK = require('node-vk-bot-api')

const bot = new VK({ token: process.env.TOKEN })

const hyash = [
    'Ты прекрасна!',
    'Твое лицо как фиолент!',
    'Трахнул бы тебя с включенным светом!',
    'Я люблю тебя!',
    'Я не пидор',
    'У тебя есть три.. нет, бесконечно желаний,к оторые я хотел бы исполнить для тебя!',
    'Хочешь я спою тебе песню?\nКонечно хочешь. Но я пока не могу ((',
    'Извини, я туповат',
]
const lovers = [];

bot.hears(['Привет', 'привет', 'Привет!', 'привет!', 'прив', 'ghbdtn'], (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Привет, няш!')
})

bot.hears(['говори', 'Говори', 'ujdjhb'], (ctx) => {
  ctx.sendMessage(ctx.user_id, hyash[randomInteger(0, hyash.length - 1)])
})

bot.hears('люби', (ctx) => {
    if (lovers.indexOf(ctx.user_id) === -1) {
        ctx.sendMessage(ctx.user_id, "Каждый час ты будешь получать фразу ❤☺")
        lovers.push(ctx.user_id);
    } else {
        ctx.sendMessage(ctx.user_id, "Я уже тебя люблю ❤💋")
    }
})
bot.hears('перестань', (ctx) => {
    if (lovers.indexOf(ctx.user_id) > -1) {
        ctx.sendMessage(ctx.user_id, "Ладно, больше не будешь получать фраз 😔")
    } else {
        ctx.sendMessage(ctx.user_id, "Я и не начинал ☺")
    }
})

bot.on((ctx) => {
  ctx.reply('Я знаю только три команды: "привет", "говори", "люби" и "перестань"')
})

bot.listen()

/**
 * each hour it sends one message to exeryone, who subscribed.
 */
setInterval(() => {
    let ph = hyash[randomInteger(0, hyash.length - 1)]
    lovers.forEach(lover => {
        bot.reply(lover, ph)
    })
}, 60 * 60 * 1000)

/**
 * Random integer random
 * 
 * @private
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} random integer number
 */
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }