require('dotenv').config()

const { expect } = require('chai')
const getEngine = require('../src/utilities/engine');

describe('engine', () => {
  let engine

  before(async () => {
    engine = await getEngine()
  })

  it('starts', () => {
    expect(engine).to.have.all.keys([
      'getBestMove',
      'quit'
    ])
  })

  it('calculates a move', async () => {
    const fen = "8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1"
    const bestMove = await engine.getBestMove(fen)
    expect(bestMove).to.have.all.keys(['to', 'from', 'flags'])
    expect(bestMove.to).to.be.a('string')
    expect(bestMove.from).to.be.a('string')
    expect(bestMove.flags).to.be.a('string')
  })

  it('handles concurrent calls', async () => {
    const fen = "8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1"
    const thinking = '0123456789'
      .split('')
      .map(() => engine.getBestMove(fen))

    const moves = await Promise.all(thinking)

    moves.forEach(move => {
      expect(move).to.have.all.keys(['to', 'from', 'flags'])
    })
  })

  after(async () => {
    engine.quit()
  })
})
