const Chess = require('./models/Chess')
const Analysis = require('./models/Analysis')
const log = require('./utilities/log')('root')

function getRoot(engine) {
  return {
    analysis({ fen }) {
      log(`analysis - ${fen}`)
      return new Analysis(engine, fen)
    },

    constants() {
      log('constants')
      return new Chess()
    },

    chess({ fen }) {
      log(`chess - fen "${fen}"`)
      return new Chess(fen, engine)
    },

    move({ input: { fen, san, move } }) {
      const chess = new Chess(fen, engine)

      if (san) {
        log(`move - fen "${fen}", san "${san}"`)
        chess.move(san)
      } else if (move) {
        log(`move - fen "${fen}", move "${move.from}${move.to}"`)
        chess.move(move)
      } else {
        throw new Error('Missing argument "san" or "move"')
      }

      return chess
    },
  }
}

module.exports = getRoot
