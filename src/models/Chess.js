const { Chess } = require('chess.js')
const Analysis = require('./Analysis')
const log = require('../utilities/log')('model/Chess')

const aliases = new Map([
  ['gameOver', 'game_over'],
  ['inCheck', 'in_check'],
  ['inCheckmate', 'in_checkmate'],
  ['inDraw', 'in_draw'],
  ['inStalemate', 'in_stalemate'],
  ['insufficientMaterial', 'insufficient_material'],
  ['inThreefoldRepetition', 'in_threefold_repetition'],
])

function get(engine, target, key) {
  if (aliases.has(key)) {
    return Reflect.get(target, aliases.get(key))
  }

  switch (key) {
    case 'moves':
      return target.moves({ verbose: true })

    case 'analysis':
      return new Analysis(engine, target.fen()).results()

    default:
      return Reflect.get(target, key)
  }
}

module.exports = function(fen, engine) {
  const chess = new Chess(fen)
  const handler = { get: get.bind(null, engine) }
  return new Proxy(chess, handler)
}
