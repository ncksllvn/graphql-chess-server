const assert = require('assert').strict
const Engine = require('../src/utilities/engine')

function assertShape({ bestMove: { from, to }}) {
  assert.ok(typeof from == 'string', 'from is a string')
  assert.ok(typeof to == 'string', 'to is a string')
}

describe('engine', async () => {
  const engine = new Engine

  before(async () => {
    await engine.initialize()
  })

  it('finds moves', async () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'
    const gettingBestMove = engine.findBestMove(fen)

    assertShape(await gettingBestMove)
  })

  it('finds moves concurrently', async () => {
    const fens = [
      '8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
      'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'
    ]

    const concurrent = await Promise.all(
      fens.map(fen => engine.findBestMove(fen))
    )

    concurrent.forEach(assertShape)
  })
})
