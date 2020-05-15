const { Chess } = require('chess.js')
const log = require('../utilities/log')('model/Game')

const handler = {
  get(target, prop) {
    const map = {
      'ascii': () => target.chess.ascii(),
      'fen': () => target.chess.fen(),
      'gameOver': () => target.chess.game_over(),
      'inCheck': () => target.chess.in_check(),
      'inCheckmate': () => target.chess.in_checkmate(),
      'inDraw': () => target.chess.in_draw(),
      'inStalemate': () => target.chess.in_stalemate(),
      'inThreefoldRepetition': () => target.chess.in_threefold_repetition(),
      'moves': () => target.chess.moves({ verbose: true }),
      'move': (move) => target.chess.move(move),
      'turn': () => target.chess.turn(),
      'constants': () => {
        return {
          BISHOP: target.chess.BISHOP,
          BLACK: target.chess.BLACK,
          FLAGS: target.chess.FLAGS,
          KING: target.chess.KING,
          KNIGHT: target.chess.KNIGHT,
          PAWN: target.chess.PAWN,
          QUEEN: target.chess.QUEEN,
          ROOK: target.chess.ROOK,
          SQUARES: target.chess.SQUARES,
          WHITE: target.chess.WHITE
        }
      }
    }

    if (prop in map) return map[prop]()

    return target[prop]
  }
}

class Game {
  constructor(fen, engine) {
    this.chess = new Chess(fen)
    this.engine = engine
    return new Proxy(this, handler)
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
