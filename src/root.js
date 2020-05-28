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

    move({ input: { fen, move: moveObj, san } }) {
      const chess = new Chess(fen, engine)

      if (!moveObj && !san) {
        throw new Error('Missing argument "san" or "move"')
      }

      const move = moveObj || san
      const stringifiedMove = san ? `san: "${san}"` :
        `from: "${move.from}", to: "${move.to}", promotion: "${move.promotion}"`

      log(`Applying move ${stringifiedMove}`)

      const moveResult = chess.move(move)

      if (!moveResult) {
        throw new Error(`Invalid move "${stringifiedMove}"`)
      }

      return chess
    },
  }
}

module.exports = getRoot
