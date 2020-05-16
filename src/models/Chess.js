const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

const aliases = new Map([
  ['BISHOP', 'BISHOP'],
  ['BLACK', 'BLACK'],
  ['FLAGS', 'FLAGS'],
  ['KING', 'KING'],
  ['KNIGHT', 'KNIGHT'],
  ['PAWN', 'PAWN'],
  ['QUEEN', 'QUEEN'],
  ['ROOK', 'ROOK'],
  ['SQUARES', 'SQUARES'],
  ['WHITE', 'WHITE'],
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
  ['moves', (chessJs) => chessJs.moves({ verbose: true })]
])

function getHandler(fen) {
  const chessJs = new ChessJS(fen)

  return {
    get(instance, key) {
      if (aliases.has(key)) {
        const prop = Reflect.get(chessJs, aliases.get(key))
        return prop.call ? prop.call(chessJs, ...arguments) : prop
      }

      if (extensions.has(key)) {
        return extensions.get(key)(chessJs, ...arguments)
      }

      return Reflect.get(instance, key)
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
