class Analysis {
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
