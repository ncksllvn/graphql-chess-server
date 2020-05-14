const getEngine = require('./utilities/engine')
const Game = require('./models/Game')
const log = require('./utilities/log')('root')

async function getRoot() {
  const engine = await getEngine()

  return {
    game({ fen }) {
      log(`executing game with fen "${fen}"`)
      return new Game(fen, engine)
    },
    makeMove({ input: { fen, move } }) {
      log(`executing makeMove with fen "${fen}", move "${move.from}${move.to}"`)
      const game = new Game(fen, engine)
      game.move(move)
      return game
    }
  }
}

module.exports = getRoot
