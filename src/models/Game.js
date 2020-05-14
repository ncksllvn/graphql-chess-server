const { Chess } = require('chess.js')
const log = require('../utilities/log')('model/Game')

class Game {
  constructor(fen, engine) {
    this.engine = engine
    this.chess = new Chess(fen)
  }

  ascii() {
    return this.chess.ascii()
  }

  async bestMove() {
    const fen = this.fen()
    const depth = 1

    log(`calculating best move for FEN ${fen} at depth ${depth}`)

    const result = await this.engine.chain()
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
