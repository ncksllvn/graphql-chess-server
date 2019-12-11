const { Chess } = require('chess.js')

class Game {
  constructor(fen, engine) {
    this.engine = engine
    this.chess = new Chess(fen)
  }

  ascii() {
    return this.chess.ascii()
  }

  bestMove() {
    return this.engine.getBestMove(this.fen())
  }

  constants() {
    return {
      BISHOP: this.chess.BISHOP,
      BLACK: this.chess.BLACK,
      FLAGS: this.chess.FLAGS,
      KING: this.chess.KING,
      KNIGHT: this.chess.KNIGHT,
      PAWN: this.chess.PAWN,
      QUEEN: this.chess.QUEEN,
      ROOK: this.chess.ROOK,
      SQUARES: this.chess.SQUARES,
      WHITE: this.chess.WHITE
    }
  }

  fen() {
    return this.chess.fen()
  }

  gameOver() {
    return this.chess.game_over()
  }

  inCheck() {
    return this.chess.in_check()
  }

  inCheckmate() {
    return this.chess.in_checkmate()
  }

  inDraw() {
    return this.chess.in_draw()
  }

  inStalemate() {
    return this.chess.in_stalemate()
  }

  inThreefoldRepetition() {
    return this.chess.in_threefold_repetition()
  }

  insufficientMaterial() {
    return this.chess.insufficient_material()
  }

  move(move) {
    this.chess.move(move)
  }

  moves() {
    return this.chess.moves({ verbose: true })
  }

  turn() {
    return this.chess.turn()
  }
}

module.exports = Game
