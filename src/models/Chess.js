const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

const rewrite = {
  gameOver: 'game_over',
  inCheck: 'in_check',
  inCheckmate: 'in_checkmate',
  inDraw: 'in_draw',
  inStalemate: 'in_stalemate',
  insufficientMaterial: 'insufficient_material',
  inThreefoldRepetition: 'in_threefold_repetition',
}

function Chess(fen, engine) {
  const chess = new ChessJS(fen)
  const keys = Object.keys(chess)

  const normalized = keys.reduce((result, key) => {
    return {
      [key in rewrite ? rewrite[key] : key]: chess[key],
      ...result
    }
  }, {})

  return {
    ...normalized,
    analysis: () => new Analysis(engine, chess.fen()).results(),
    moves: () => chess.moves({ verbose: true })
  }
}

module.exports = Chess
