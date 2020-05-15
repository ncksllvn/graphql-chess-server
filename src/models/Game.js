const { Chess } = require('chess.js')
const log = require('../utilities/log')('model/Game')

class Game {

  static handler = {
    get(instance, property) {
      const map = {
        ascii: () => instance.chess.ascii(),
        fen: () => instance.chess.fen(),
        gameOver: () => instance.chess.game_over(),
        inCheck: () => instance.chess.in_check(),
        inCheckmate: () => instance.chess.in_checkmate(),
        inDraw: () => instance.chess.in_draw(),
        inStalemate: () => instance.chess.in_stalemate(),
        inThreefoldRepetition: () => instance.chess.in_threefold_repetition(),
        moves: () => instance.chess.moves({ verbose: true }),
        move: (move) => instance.chess.move(move),
        turn: () => instance.chess.turn(),
        constants: () => {
          return {
            BISHOP: instance.chess.BISHOP,
            BLACK: instance.chess.BLACK,
            FLAGS: instance.chess.FLAGS,
            KING: instance.chess.KING,
            KNIGHT: instance.chess.KNIGHT,
            PAWN: instance.chess.PAWN,
            QUEEN: instance.chess.QUEEN,
            ROOK: instance.chess.ROOK,
            SQUARES: instance.chess.SQUARES,
            WHITE: instance.chess.WHITE
          }
        }
      }

      if (property in map) return map[property]()

      return instance[property]
    }
  }

  constructor(fen, engine) {
    this.chess = new Chess(fen)
    this.engine = engine
    return new Proxy(this, Game.handler)
  }

  async bestMove() {
    const fen = this.fen
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
}

module.exports = Game
