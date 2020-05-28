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
      'rn1qkb1r/pp3pp1/2p1p3/3p3p/3PnPb1/3BP1P1/PPPB3P/RNQ1K1NR w KQkq - 0 8'
    ]

    const concurrent = await Promise.all(
      fens.map(fen => engine.findBestMove(fen))
    )

    concurrent.forEach(assertShape)

    const uniqueMoves = new Set(
      concurrent
        .map(moves => moves.bestMove)
        .map(move =>`${move.from}${move.to}`)
    )

    assert.equal(
      uniqueMoves.size,
      fens.length,
      'All of the moves are unique'
    )
  })
})
