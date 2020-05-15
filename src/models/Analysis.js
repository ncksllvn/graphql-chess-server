const log = require('../utilities/log')('Analysis')

class Analysis {

  static parseMove(string) {
    const [
      fromColumn,
      fromRow,
      toColumn,
      toRow,
      ...flags
    ] = string

    return {
      from: `${fromColumn}${fromRow}`,
      to: `${toColumn}${toRow}`,
      flags: flags.join('')
    }
  }

  constructor(engine, fen) {
    this.engine = engine
    this.fen = fen
  }

  async results() {
    const result = await this.engine.chain()
      .position(this.fen)
      .go({ depth: 1 })

    return {
      bestMove: Analysis.parseMove(result.bestmove),
      ponderMove: Analysis.parseMove(result.ponder)
    }
  }
}

module.exports = Analysis
