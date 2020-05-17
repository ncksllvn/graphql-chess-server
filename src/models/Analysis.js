const log = require('../utilities/log')('Analysis')

class Analysis {
  static parseMove(string) {
    return {
      from: string.slice(0, 2),
      to: string.slice(2, 4),
      flags: string.slice(4)
    }
  }

  constructor(engine, fen) {
    this.engine = engine
    this.fen = fen
  }

  async results() {
    log(`calculating moves for fen "${this.fen}`)

    const result = await this.engine.chain()
      .position(this.fen)
      .go({ depth: 1 })

    log(`received result bestmove ${result.bestmove}, ponder ${result.ponder}`)

    return {
      bestMove: result.bestmove && Analysis.parseMove(result.bestmove),
      ponderMove: result.ponder && Analysis.parseMove(result.ponder)
    }
  }
}

module.exports = Analysis
