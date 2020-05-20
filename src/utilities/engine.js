const logger = require('./log')
const Stockfish = require('stockfish')

// UCI protocol:
// http://wbec-ridderkerk.nl/html/UCIProtocol.html

const log = logger('engine')
const logReceived = logger('engine:received')

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

          this.commandQueue.pop()
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

  async findBestMove(fen, depth = 1) {
    const result = await this.issueCommand({
      command: [
        'ucinewgame',
        `position "${fen}"`,
        `go depth ${depth}`
      ],
      listener: (message) => message.startsWith('bestmove')
    })

    const [label, bestMove] = result.split(' ')

    return {
      bestMove: {
        from: bestMove.slice(0, 2),
        to: bestMove.slice(2)
      }
    }
  }
}

module.exports = Engine
