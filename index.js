const VK = require('node-vk-bot-api');
const fs = require('fs');
const path = require('path');
const MarkovChain = require('markovchain');
const _ = require('lodash');

const bot = new VK({ token: process.env.TOKEN });

if (!process.env.NICE_WORDS || !process.env.CLIENTS) {
    throw new Error('env vars are required');
}

const librarySource = path.resolve(process.env.LIBRARY);
const adminId = process.env.ADMIN;

const library = new MarkovChain(fs.readFileSync(librarySource, 'utf8'), cleanWords);

const commands = {
    hello: ['привет','привет!', 'прив', 'ghbdtn'],
    say: ['говори', 'ujdjhb'],
    love: ['люби'],
    stop: ['перестань'],
    fooo: ['хуйня', 'заебал'],
    keywords: ['/команды'],

    // admin
    admin: {
        niceSet: '/nice-set',
        niceUnset: '/nice-unset',
        niceAll: '/nice-all',
    }
};

const {
    getNiceWord,
    setNiceWord,
    unsetNiceWord,
    getClients,
    setClient,
    unsetClient,
} = require('./lib.js');

bot.hears(commands.hello, (ctx) => {
    ctx.sendMessage(ctx.user_id, 'Привет, няш!\nЯ могу говорить с тобой, а еще я знаю эти команды: "привет", "говори", "люби" и "перестань"');
});

bot.hears(commands.say, (ctx) => {
    ctx.sendMessage(ctx.user_id, getNiceWord());
});

bot.hears(commands.love, (ctx) => {
    if (setClient(ctx.user_id)) {
        ctx.sendMessage(ctx.user_id, 'Каждый час ты будешь получать фразу ❤☺');
    } else {
        ctx.sendMessage(ctx.user_id, 'Я уже тебя люблю ❤💋');
    }
});
bot.hears(commands.stop, (ctx) => {
    if (unsetClient(ctx.user_id)) {
        ctx.sendMessage(ctx.user_id, 'Ладно, больше не будешь получать фраз 😔');
    } else {
        ctx.sendMessage(ctx.user_id, 'Я и не начинал ☺');
    }
});
bot.hears(commands.keywords, (ctx) => {
    ctx.reply('Я знаю только эти команды: "привет", "говори", "люби" и "перестань". Но ты можешь говорить мне много других вещей, я попытаюсь пообщаться в тобой.');
});

bot.hears(commands.admin.niceSet, (ctx) => {
    if (!admin(ctx)) {
        return;
    }
    let word = ctx.body.slice(commands.admin.niceSet.length).trim().split('\n').join('\\n');

    if (setNiceWord(word)) {
        ctx.reply('Ok');
    } else {
        ctx.reply('Exists:\n' + word);
    }
});
bot.hears(commands.admin.niceUnset, (ctx) => {
    if (!admin(ctx)) {
        return;
    }
    let word = ctx.body.slice(commands.admin.niceUnset.length).trim().split('\n').join('\\n');

    if (unsetNiceWord(word)) {
        ctx.reply('Ok');
    } else {
        ctx.reply('Not Exists:\n' + word);
    }
});

const strangeStart = ['бы'];
const strangeEnd = ['что', 'как', '-', 'и', 'у', 'а', 'в', 'с', 'о', 'на', 'из'];
bot.on((ctx) => {
    let words = ctx.body.split(' ').map(cleanWords).filter(e => !!e.length && strangeStart.indexOf(e) === -1);

    let quote = library
        .start((list) => {
            let l = Object.keys(list);
            while (words.length > 0) {
                let word = _.pullAt(words, randomInteger(0, words.length - 1))[0];
                if (l.indexOf(word) > -1) {
                    return word;
                }
            }
            return _.sample(l);
        })
        .end(randomInteger(5, 10))
        .process();

    // clean from strange endings
    quote = quote.split(' ');
    while (true) {
        if (strangeEnd.indexOf(_.last(quote)) > -1) {
            _.pullAt(quote, quote.length - 1);
            continue;
        }
        break;
    }

    ctx.reply(_.upperFirst(quote.join(' ')));
});

bot.listen();

/**
 * each hour it sends one message to exeryone, who subscribed.
 */
setInterval(() => {
    let niceWord = getNiceWord();
    let clients = getClients();

    clients.forEach(client => {
        bot.reply(client, niceWord);
    });
}, 60 * 60 * 1000);
// }, 30 * 1000)

/* Private */
function admin(ctx) {
    if (ctx.user_id.toString() === adminId.toString()) {
        return true;
    }
    ctx.sendMessage(ctx.user_id, 'Это не для вас написано ☺');
    return false;
}

/**
 * Random integer random
 * 
 * @private
 * @param {Number} min 
 * @param {Number} max 
 * @return {Number} random integer number
 */
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function cleanWords(input) {
    input = input.replace(/[^0-9A-zА-я\-]/gi, '');

    return _.lowerCase(input);
}