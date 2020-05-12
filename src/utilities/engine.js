const { Engine } = require('node-uci')
const debug = require('debug')('game:engine')
const config = require('../config')

function getBestMove(engine) {
  return async (fen, depth = 1) => {
    const result = await engine.chain()
      .position(fen)
      .go({ depth })

    return result.bestmove
  }
}

async function getEngine() {
  debug(`creating from "${config.ENGINE}"...`)

  const engine = new Engine(config.ENGINE)

  debug('created')

  try {
    engine.init()
    debug('initialized')
    return {
      getBestMove: getBestMove(engine)
    }
  } catch(err) {
    debug('failed to initialize')
    throw err
  }
}

module.exports = getEngine
