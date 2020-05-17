const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

const aliases = {
  gameOver: 'game_over',
  inCheck: 'in_check',
  inCheckmate: 'in_checkmate',
  inDraw: 'in_draw',
  inStalemate: 'in_stalemate',
  insufficientMaterial: 'insufficient_material',
  inThreefoldRepetition: 'in_threefold_repetition'
}

function aliasMethods(chess) {
  return Object
    .entries(aliases)
    .reduce((result, [alias, key]) => {
      return {
        [alias]: chess[key],
        ...result
      }
    }, chess)
}

function Chess(fen, engine) {
  const chess = new ChessJS(fen)
  const normalized = aliasMethods(chess)

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
