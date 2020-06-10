const logger = require('./log')
const Stockfish = require('stockfish')

// UCI protocol:
// http://wbec-ridderkerk.nl/html/UCIProtocol.html

const log = logger('engine')
const logReceived = logger('engine:received')

const noBestMove = '(none)'

class Engine {
  constructor() {
    this.commandQueue = []
    this.stockfish = new Stockfish()
    this.stockfish.onmessage = this.onMessage
  }

  onMessage = (message) => {
    logReceived(message)
    if (this.commandQueue.length) {
      const [{ onMessage }] = this.commandQueue
      onMessage(message)
    }
  }

  postMessage(messages) {
    messages.forEach(message => {
      this.stockfish.postMessage(message)
    })
  }

  issueCommand({ command, listener }) {
    log(`enqueuing command ${command}`)

    return new Promise(resolve => {
      const onMessage = message => {
        if (listener(message)) {
          log(`command finished with response "${message}"`)
          resolve(message)

          this.commandQueue.shift()
          if (this.commandQueue.length) {
            const [{ command }] = this.commandQueue
            this.postMessage(command)
          }
        }
      }

      this.commandQueue.push({
        command,
        onMessage
      })

      if (this.commandQueue.length === 1) {
        log(`sending command ${command}`)
        this.postMessage(command)
      }
    })
  }

  initialize() {
    log(`starting engine...`)
    return this.issueCommand({
      command: ['uci'],
      listener: message => message == 'uciok'
    })
  }

  parseMove(move) {
    return {
      from: move.slice(0, 2),
      to: move.slice(2, 4),
      flags: move.slice(4)
    }
  }

  async findBestMove(fen, depth = 1) {
    const result = await this.issueCommand({
      command: [
        'isready',
        'ucinewgame',
        `position fen ${fen}`,
        `go depth ${depth}`
      ],
      listener: (message) => message.startsWith('bestmove')
    })

    let [ ,bestMove, ,ponderMove] = result.split(' ')

    if (bestMove === noBestMove) {
      bestMove = null
      ponderMove = null
    } else {
      bestMove = this.parseMove(bestMove)
      ponderMove = ponderMove && this.parseMove(ponderMove)
    }

    return {
      bestMove,
      ponderMove
    }
  }
}

module.exports = Engine
