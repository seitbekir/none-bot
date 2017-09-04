const VK = require('node-vk-bot-api')
const fs = require('fs')
const path = require('path')

const bot = new VK({ token: process.env.TOKEN })

if (!process.env.NICE_WORDS || !process.env.CLIENTS) {
    throw new Error('env vars are required')
}

const niceWordsSource = path.resolve(process.env.NICE_WORDS)
const clientsSource = path.resolve(process.env.CLIENTS)
const adminId = process.env.ADMIN

const commands = {
    hello: ['привет','привет!', 'прив', 'ghbdtn'],
    say: ['говори', 'ujdjhb'],
    love: ['люби'],
    stop: ['перестань'],
    fooo: ['хуйня', 'заебал'],

    // admin
    admin: {
        niceSet: '/nice-set',
        niceUnset: '/nice-unset',
    }
}

bot.hears(commands.hello, (ctx) => {
    ctx.sendMessage(ctx.user_id, 'Привет, няш!')
})

bot.hears(commands.say, (ctx) => {
    ctx.sendMessage(ctx.user_id, getNiceWord())
})

bot.hears(commands.love, (ctx) => {
    if (setClient(ctx.user_id)) {
        ctx.sendMessage(ctx.user_id, 'Каждый час ты будешь получать фразу ❤☺')
    } else {
        ctx.sendMessage(ctx.user_id, 'Я уже тебя люблю ❤💋')
    }
})
bot.hears(commands.stop, (ctx) => {
    if (unsetClient(ctx.user_id)) {
        ctx.sendMessage(ctx.user_id, 'Ладно, больше не будешь получать фраз 😔')
    } else {
        ctx.sendMessage(ctx.user_id, 'Я и не начинал ☺')
    }
})

bot.hears(commands.admin.niceSet, (ctx) => {
    if (!admin(ctx)) {
        return
    }
    let word = ctx.body.slice(commands.admin.niceSet.length).trim().split('\n').join('\\n')

    if (setNiceWord(word)) {
        ctx.reply('Ok')
    } else {
        ctx.reply('Exists:\n' + word)
    }
})
bot.hears(commands.admin.niceUnset, (ctx) => {
    if (!admin(ctx)) {
        return
    }
    let word = ctx.body.slice(commands.admin.niceUnset.length).trim().split('\n').join('\\n')

    if (unsetNiceWord(word)) {
        ctx.reply('Ok')
    } else {
        ctx.reply('Not Exists:\n' + word)
    }
})

bot.on((ctx) => {
    ctx.reply('Я знаю только эти команды: "привет", "говори", "люби" и "перестань"')
})

bot.listen()

/**
 * each hour it sends one message to exeryone, who subscribed.
 */
setInterval(() => {
    let niceWord = getNiceWord()
    let clients = getClients()

    clients.forEach(client => {
        bot.reply(client, niceWord)
    })
}, 60 * 60 * 1000)
// }, 30 * 1000)

/* Private */
function admin(ctx) {
    if (ctx.user_id.toString() === adminId.toString()) {
        return true
    }
    ctx.sendMessage(ctx.user_id, 'Это не для вас написано ☺')
    return false
}

/**
 * Random integer random
 * 
 * @private
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} random integer number
 */
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min)
    rand = Math.floor(rand)
    return rand
}

function getNiceWord() {
    let niceWords = getNiceWords()
    return niceWords[randomInteger(0, niceWords.length - 1)]
}
function getNiceWords() {
    try {
        let niceWords = fs.readFileSync(niceWordsSource).toString().split('\n')
        return niceWords.filter(e => e !== '')
    } catch(err) {
        console.error(err)
        return []
    }
}
function setNiceWord(word) {
    try {
        let niceWords = getNiceWords()
        if (niceWords.indexOf(word) === -1) {
            niceWords.push(word)
            
            fs.writeFileSync(niceWordsSource, niceWords.join('\n'))
            return true
        }
        return false
    } catch(err) {
        console.error(err)
        return false
    }
}
function unsetNiceWord(word) {
    try {
        let niceWords = getNiceWords()
        if (niceWords.indexOf(word) > -1) {
            niceWords.splice(niceWords.indexOf(word), 1)

            fs.writeFileSync(niceWordsSource, niceWords.join('\n'))
            return true
        }
        return false
    } catch(err) {
        console.error(err)
        return false
    }
}

function getClients() {
    try {
        let clients = fs.readFileSync(clientsSource).toString().split('\n')
        return clients.filter(e => e !== '')
    } catch(err) {
        console.error(err)
        return []
    }
}
function setClient(peerId) {
    try {
        peerId = peerId.toString()
        let clients = getClients()
        if (clients.indexOf(peerId) === -1) {
            clients.push(peerId)
            
            fs.writeFileSync(clientsSource, clients.join('\n'))
            return true
        }
        return false
    } catch(err) {
        console.error(err)
        return false
    }
}
function unsetClient(peerId) {
    try {
        peerId = peerId.toString()
        let clients = getClients()
        if (clients.indexOf(peerId) > -1) {
            clients.splice(clients.indexOf(peerId), 1)

            fs.writeFileSync(clientsSource, clients.join('\n'))
            return true
        }
        return false
    } catch(err) {
        console.error(err)
        return false
    }
}
