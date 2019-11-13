const Chess = require('chess.js').Chess

class Game {
  constructor(fen) {
    this.chess = new Chess(fen)
  }

  ascii() {
    return this.chess.ascii()
  }

  fen() {
    return this.chess.fen()
  }

  moves() {
    return this.chess.moves()
  }

  inCheck() {
    return this.chess.in_check()
  }

  history() {
    return this.chess.history()
  }

  move(move) {
    this.chess.move(move)
  }
}

module.exports = Game
