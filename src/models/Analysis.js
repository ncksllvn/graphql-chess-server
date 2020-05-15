const log = require('../utilities/log')('Analysis')

class Analysis {
  constructor(engine, fen) {
    this.engine = engine
    this.fen = fen
  }

  async results() {
    const result = await this.engine.chain()
      .position(this.fen)
      .go({ depth: 1 })

    log(result)

    const [
      fromColumn,
      fromRow,
      toColumn,
      toRow,
      ...flags
    ] = result.bestmove

    const bestMove = {
      from: `${fromColumn}${fromRow}`,
      to: `${toColumn}${toRow}`,
      flags: flags.join('')
    }

    return {
      bestMove
    }
  }
}

module.exports = Analysis
