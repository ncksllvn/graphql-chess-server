const log = require('./utilities/log')
const Stockfish = require('stockfish')

// UCI protocol -
// http://wbec-ridderkerk.nl/html/UCIProtocol.html

const logger = {
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
    logger.received(message)
    if (this.commandQueue.length) {
      const [{ onMessage }] = this.commandQueue
      onMessage(message)
    }
  }

  postMessage(message) {
    logger.sent(message)
    this.stockfish.postMessage(message)
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
          resolve()
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

  findBestMove(fen) {

  }
}

(async () => {
  const engine = new Engine

  await engine.issueCommand({
    command: 'uci',
    listener: message => message == 'uciok'
  })

  engine.postMessage('ucinewgame')
  engine.postMessage('position "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1"')

  await engine.issueCommand({
    command: 'go depth 1',
    listener: () => true
  })


})()
