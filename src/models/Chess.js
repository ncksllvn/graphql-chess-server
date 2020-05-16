const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

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
  const chessJs = new ChessJS(fen)

  return {
    get(instance, property, _receiver) {
      if (aliases.has(property)) {
        return Reflect.get(chessJs, aliases.get(property))(...arguments)
      }

      if (extensions.has(property)) {
        return extensions.get(property)(chessJs, ...arguments)
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

  async analysis() {
    return await new Analysis(this.engine, this.fen).results()
  }
}

module.exports = Chess
