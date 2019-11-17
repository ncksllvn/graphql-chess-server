const Chess = require('chess.js').Chess

class Game {
  constructor(fen) {
    this.chess = new Chess(fen)
  }

  ascii() {
    return this.chess.ascii()
  }

  clear() {
    this.chess.clear()
  }

  fen() {
    return this.chess.fen()
  }

  gameOver() {
    return this.chess.game_over()
  }

  get({ square }) {
    return this.chess.get(square)
  }

  history() {
    return this.chess.history()
  }

  inCheck() {
    return this.chess.in_check()
  }

  inCheckmate() {
    return this.chess.in_checkmate()
  }

  inDraw() {
    return this.chess.in_draw()
  }

  inStalemate() {
    return this.chess.in_stalemate()
  }

  inThreefoldRepetition() {
    return this.chess.in_threefold_repetition()
  }

  header({ headers }) {
    this.chess.header(headers)
  }

  insufficientMaterial() {
    return this.chess.insufficient_material()
  }

  move({ move }) {
    this.chess.move(move)
  }

  moves() {
    return this.chess.moves({ verbose })
  }

  put({ piece, square }) {
    return this.chess.put(piece, square)
  }

  remove({ square }) {
    return this.chess.remove(square)
  }

  reset() {
    this.chess.reset()
  }

  squareColor({ square }) {
    return this.chess.square_color(square)
  }

  turn() {
    return this.chess.turn()
  }

  undo() {
    return this.chess.undo()
  }

  validateFen({ fen }) {
    return this.chess.validate_fen(fen)
  }
}

module.exports = Game
