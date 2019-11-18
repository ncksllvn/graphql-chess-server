const { Engine } = require('node-uci')
const config = require('../config')

class AI {
  constructor() {
    this.engine = new Engine(config.ENGINE)
  }

  initialize() {
    return this.engine.init()
  }

  async getBestMove(fen, depth = 1) {
    const result = await this.engine.chain()
      .position(fen)
      .go({ depth })

    return result.bestmove
  }
}

module.exports = new AI()
