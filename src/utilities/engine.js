const { Engine } = require('node-uci')
const config = require('../config')

const engine = new Engine(config.ENGINE)

function initialize() {
  return engine.init()
}

async function getBestMove(fen, depth = 1) {
  const result = await engine.chain()
    .position(fen)
    .go({ depth })

  return result.bestmove
}

module.exports = {
  initialize,
  getBestMove
}
