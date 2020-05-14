const { Engine } = require('node-uci')
const log = require('./log')('engine')
const config = require('../config')

function getBestMove(engine) {
  return async (fen, depth = 1) => {
    log(`calculating best move for FEN ${fen} at depth ${depth}`)

    const result = await engine.chain()
      .position(fen)
      .go({ depth })

    const {
      bestmove: bestMove
    } = result

    log(`calcuated best move as ${bestMove}`)

    const [
      fromColumn,
      fromRow,
      toColumn,
      toRow,
      ...flags
    ] = bestMove

    return {
      from: `${fromColumn}${fromRow}`,
      to: `${toColumn}${toRow}`,
      flags: flags.join('')
    }
  }
}

async function getEngine() {
  log(`spawning process from "${config.ENGINE}"...`)

  const engine = new Engine(config.ENGINE)

  log('spawned!')

  try {
    log('initializing...')

    await engine.init()

    log('initialized!')

    return {
      getBestMove: getBestMove(engine)
    }
  } catch(err) {
    log('failed to initialize')
    throw err
  }
}

module.exports = getEngine
