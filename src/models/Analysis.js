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
    const {
      bestMove,
      ponderMove
    } = await this.engine.findBestMove(this.fen)

    return {
      bestMove,
      ponderMove,
    }
  }
}

module.exports = Analysis
