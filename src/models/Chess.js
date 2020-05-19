const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

function Chess(fen, engine) {
  const chess = {
    board() {
      const [ a, b, c, d, e, f, g, h ] = super.board()
      return { a, b, c, d, e, f, g, h }
    },
    gameOver() {
      return this.game_over()
    },
    inCheck() {
      return this.in_check()
    },
    inCheckmate() {
      return this.in_checkmate()
    },
    inDraw() {
      return this.in_draw()
    },
    inStalemate() {
      return this.in_stalemate()
    },
    insufficientMaterial() {
      return this.insufficient_material()
    },
    inThreefoldRepetition() {
      return this.in_threefold_repetition()
    },
    moves() {
      return super.moves({ verbose: true })
    },
    analysis() {
      return new Analysis(engine, this.fen()).results()
    }
  }

  return Object.setPrototypeOf(chess, new ChessJS(fen))
}

module.exports = Chess
