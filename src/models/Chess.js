const { Chess: ChessJS } = require('chess.js')
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
  if (key == 'moves') {
    return target.moves({ verbose: true })
  }

  if (key == 'analysis') {
    return new Analysis(engine, target.fen()).results()
  }

  const translatedKey = aliases.has(key) ? aliases.get(key) : key
  const value = Reflect.get(target, translatedKey)

  log(`${key} -> target.${translatedKey}`)

  return value
}

function Chess(fen, engine) {
  const chess = new ChessJS(fen)
  const handler = { get: get.bind(null, engine) }
  return new Proxy(chess, handler)
}

module.exports = Chess
