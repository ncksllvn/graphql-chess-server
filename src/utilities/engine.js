const log = require('./log')
const Stockfish = require('stockfish')

// UCI protocol -
// http://wbec-ridderkerk.nl/html/UCIProtocol.html

const EngineLogger = {
  log: log('engine:'),
  received: log('engine:received'),
  sent: log('engine:sent')
}

class Engine {
  constructor() {
    this.commandQueue = []
    this.stockfish = new Stockfish()
    this.stockfish.onmessage = this.onMessage
  }

  onMessage = (message) => {
    EngineLogger.received(message)
    if (this.commandQueue.length) {
      const [{ onMessage }] = this.commandQueue
      onMessage(message)
    }
  }

  postMessage(messages) {
    messages.forEach(message => {
      EngineLogger.sent(message)
      this.stockfish.postMessage(message)
    })
  }

  issueCommand({ command, listener }) {
    return new Promise(resolve => {
      const onMessage = message => {
        if (listener(message)) {
          this.commandQueue.pop()
          if (this.commandQueue.length) {
            const [{ command }] = this.commandQueue
            this.postMessage(command)
          }
          resolve(message)
        }
      }

      this.commandQueue.push({
        command,
        onMessage
      })

      if (this.commandQueue.length === 1) {
        this.postMessage(command)
      }
    })
  }

  initialize() {
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
