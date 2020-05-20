const assert = require('assert').strict
const Engine = require('../src/utilities/engine')

function assertShape({ bestMove: { from, to }}) {
  assert.ok(typeof from == 'string', 'from is a string')
  assert.ok(typeof to == 'string', 'to is a string')
}

async function main() {
  const engine = new Engine

  await assert.doesNotReject(engine.initialize(), 'The engine starts')

  const gettingBestMove = engine
    .findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1')

  await assert.doesNotReject(gettingBestMove, 'It gets the best move')
  assertShape(await gettingBestMove)

  const concurrent = Promise.all([
    engine.findBestMove('8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1'),
    engine.findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1')
  ])

  await assert.doesNotReject(concurrent, 'It handles concurrent calls')

  const concurrentResults = await concurrent
  concurrentResults.forEach(assertShape)
}

module.exports = main
