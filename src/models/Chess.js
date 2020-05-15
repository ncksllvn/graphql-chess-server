const { Chess: ChessJS } = require('chess.js')
const log = require('../utilities/log')('model/Game')

const aliases = new Map([
  ['ascii', 'ascii'],
  ['fen', 'fen'],
  ['gameOver', 'game_over'],
  ['inCheck', 'in_check'],
  ['inCheckmate', 'in_checkmate'],
  ['inDraw', 'in_draw'],
  ['inStalemate', 'in_stalemate'],
  ['insufficientMaterial', 'insufficient_material'],
  ['inThreefoldRepetition', 'in_threefold_repetition'],
  ['move', 'move'],
  ['turn', 'turn'],
])

const extensions = new Map([
  ['moves', (chessJs) => chessJs.moves({ verbose: true })],
  ['constants', (chessJs) => {
    return {
      BISHOP: chessJs.BISHOP,
      BLACK: chessJs.BLACK,
      FLAGS: chessJs.FLAGS,
      KING: chessJs.KING,
      KNIGHT: chessJs.KNIGHT,
      PAWN: chessJs.PAWN,
      QUEEN: chessJs.QUEEN,
      ROOK: chessJs.ROOK,
      SQUARES: chessJs.SQUARES,
      WHITE: chessJs.WHITE
    }
  }]
])

function getHandler(fen) {
  const chess = new ChessJS(fen)

  return {
    get(instance, property, _receiver) {
      if (aliases.has(property)) {
        return Reflect.get(chess, aliases.get(property))()
      }

      if (extensions.has(property)) {
        return extensions.get(property)(chess, ...arguments)
      }

      return Reflect.get(instance, property)
    }
  }
}

class Chess {
  constructor(fen, engine) {
    this.engine = engine
    return new Proxy(this, getHandler(fen))
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

module.exports = Chess
