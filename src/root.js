const Chess = require('./models/Chess')
const log = require('./utilities/log')('root')

function getRoot(engine) {
  return {
    constants() {
      return new Chess().constants
    },

    chess({ fen }) {
      log(`executing game with fen "${fen}"`)
      return new Chess(fen, engine)
    },

    makeMove({ input: { fen, move } }) {
      log(`executing makeMove with fen "${fen}", move "${move.from}${move.to}"`)
      const chess = new Chess(fen, engine)
      chess.move(move)
      return chess
    }
  }
}

module.exports = getRoot
