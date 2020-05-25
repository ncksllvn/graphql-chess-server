const { Chess: ChessJS } = require('chess.js')
const Analysis = require('./Analysis')

function Chess(fen, engine) {
  const chess = {
    board() {
      const files = 'abcdefgh'
      const ranks = 8
      const rows = super.board()
      return rows.map((pieces, rowIndex) => {
        return {
          rank: ranks - rowIndex,
          squares: pieces.map((piece, columnIndex) => {
            return {
              file: files[columnIndex],
              piece
            }
          })
        }
      })
    },
    gameOver() {
      return this.game_over()
    },
    inCheck() {
      return this.in_check()
    },
    inCheckmate() {
      return this.in_checkmate()
    },
    inDraw() {
      return this.in_draw()
    },
    inStalemate() {
      return this.in_stalemate()
    },
    insufficientMaterial() {
      return this.insufficient_material()
    },
    inThreefoldRepetition() {
      return this.in_threefold_repetition()
    },
    moves() {
      return super.moves({ verbose: true })
    },
    analysis() {
      return new Analysis(engine, this.fen()).results()
    }
  }

  return Object.setPrototypeOf(chess, new ChessJS(fen))
}

module.exports = Chess
