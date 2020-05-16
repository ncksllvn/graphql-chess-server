const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

const normalization = new Map([
  ['game_over', 'gameOver'],
  ['in_check', 'inCheck'],
  ['in_checkmate', 'inCheckmate'],
  ['in_draw', 'inDraw'],
  ['in_stalemate', 'inStalemate'],
  ['insufficient_material', 'insufficientMaterial'],
  ['in_threefold_repetition', 'inThreefoldRepetition']
])

function normalizeKeys(chess) {
  const keys = Object.keys(chess)

  return keys.reduce((result, key) => {
    const normalized = normalization.has(key) ? normalization.get(key) : key
    return {
      [normalized]: chess[key],
      ...result
    }
  }, {})
}

function Chess(fen, engine) {
  const chess = new ChessJS(fen)
  const normalized = normalizeKeys(chess)

  return {
    ...normalized,
    engine,
    moves: normalized.moves.bind(normalized, { verbose: true }),
    analysis() {
      return new Analysis(this.engine, this.fen()).results()
    }
  }
}

module.exports = Chess
