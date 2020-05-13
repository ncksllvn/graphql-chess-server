const { Engine } = require('node-uci')
const log = require('./log')('engine')
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
  log(`creating from "${config.ENGINE}"...`)

  const engine = new Engine(config.ENGINE)

  log('created')

  try {
    log('initializing...')
    await engine.init()
    log('initialized')
    return {
      getBestMove: getBestMove(engine)
    }
  } catch(err) {
    log('failed to initialize')
    throw err
  }
}

module.exports = getEngine
