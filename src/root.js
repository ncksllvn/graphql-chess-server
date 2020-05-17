const Chess = require('./models/Chess')
const Analysis = require('./models/Analysis')
const log = require('./utilities/log')('root')

function getRoot(engine) {
  return {
    analysis({ fen }) {
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

    makeMove({ input: { fen, move } }) {
      log(`makeMove - fen "${fen}", move "${move.from}${move.to}"`)
      const chess = new Chess(fen, engine)
      chess.move(move)
      return chess
    }
  }
}

module.exports = getRoot
