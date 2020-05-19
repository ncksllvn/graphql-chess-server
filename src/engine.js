const log = require('./utilities/log')
const Stockfish = require('stockfish')

let stockfish

// http://wbec-ridderkerk.nl/html/UCIProtocol.html
const COMMANDS = {
  NEW_GAME: 'ucinewgame',
  SWITCH_TO_UCI_MODE: 'uci',
  POSITION: 'position'
}

const RESPONSES = {
  READY: 'uciok'
}

const logger = {
  log: log('engine:'),
  received: log('engine:received'),
  sent: log('engine:sent')
}

function postMessage(message){
  logger.sent(message)
  stockfish.postMessage(message)
}

function initialize() {
  stockfish = new Stockfish()

  return new Promise((resolve) => {
    stockfish.onmessage = (message) => {
      logger.received(message)

      if (message === RESPONSES.READY) {
        logger.log('engine is initialized')
        resolve()
      }
    }

    postMessage(COMMANDS.SWITCH_TO_UCI_MODE)
  })
}

module.exports = {
  initialize
}
