const log = require('./utilities/log')
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

  findBestMove(fen, depth = 1) {
    return this.issueCommand({
      command: [
        'ucinewgame',
        `position "${fen}"`,
        `go depth ${depth}`
      ],
      listener: (message) => message.startsWith('bestmove')
    })
  }
}

(async () => {
  const engine = new Engine

  await engine.initialize()

  const bunch = await Promise.all([
    engine.findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'),
    engine.findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'),
    engine.findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'),
    engine.findBestMove('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'),
  ])

  console.log(bunch)
})()
