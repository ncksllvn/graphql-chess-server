const assert = require('assert').strict
const startServer = require('../src')

async function main() {
  const serverStarting = startServer()

  await assert.doesNotReject(serverStarting, 'The server starts')

  const shutdown = await serverStarting
  const shuttingDown = shutdown()

  await assert.doesNotReject(shuttingDown, 'The server stops')
}

main()
