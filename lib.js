const fs = require('fs');
const path = require('path');

const niceWordsSource = path.resolve(process.env.NICE_WORDS);
const clientsSource = path.resolve(process.env.CLIENTS);

module.exports = {
    getNiceWord,
    getNiceWords,
    setNiceWord,
    unsetNiceWord,
    getClients,
    setClient,
    unsetClient,
};

function getNiceWord() {
    let niceWords = getNiceWords();
    return niceWords[randomInteger(0, niceWords.length - 1)];
}
function getNiceWords() {
    try {
        let niceWords = fs.readFileSync(niceWordsSource).toString().split('\n');
        return niceWords.filter(e => e !== '').map(e => e.split('\\n').join('\n'));
    } catch(err) {
        console.error(err);
        return [];
    }
}
function setNiceWord(word) {
    try {
        let niceWords = getNiceWords();
        if (niceWords.indexOf(word) === -1) {
            niceWords.push(word);
            niceWords = niceWords.map(e => e.split('\n').join('\\n'));
            
            fs.writeFileSync(niceWordsSource, niceWords.join('\n'));
            return true;
        }
        return false;
    } catch(err) {
        console.error(err);
        return false;
    }
}
function unsetNiceWord(word) {
    try {
        let niceWords = getNiceWords();
        if (niceWords.indexOf(word) > -1) {
            niceWords.splice(niceWords.indexOf(word), 1);
            niceWords = niceWords.map(e => e.split('\n').join('\\n'));

            fs.writeFileSync(niceWordsSource, niceWords.join('\n'));
            return true;
        }
        return false;
    } catch(err) {
        console.error(err);
        return false;
    }
}

function getClients() {
    try {
        let clients = fs.readFileSync(clientsSource).toString().split('\n');
        return clients.filter(e => e !== '');
    } catch(err) {
        console.error(err);
        return [];
    }
}
function setClient(peerId) {
    try {
        peerId = peerId.toString();
        let clients = getClients();
        if (clients.indexOf(peerId) === -1) {
            clients.push(peerId);
            
            fs.writeFileSync(clientsSource, clients.join('\n'));
            return true;
        }
        return false;
    } catch(err) {
        console.error(err);
        return false;
    }
}
function unsetClient(peerId) {
    try {
        peerId = peerId.toString();
        let clients = getClients();
        if (clients.indexOf(peerId) > -1) {
            clients.splice(clients.indexOf(peerId), 1);

            fs.writeFileSync(clientsSource, clients.join('\n'));
            return true;
        }
        return false;
    } catch(err) {
        console.error(err);
        return false;
    }
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