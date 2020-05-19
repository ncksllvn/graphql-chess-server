require('dotenv').config()

const fs = require('fs')
const path = require('path')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { Engine } = require('node-uci')

const log = require('./utilities/log')('server')
const getRoot = require('./root')

async function main() {
  const app = express()

  const schema = buildSchema(
    fs.readFileSync(
      path.join(__dirname, 'schema.graphql')
    ).toString()
  )

  log('starting engine...')

  const engine = new Engine(
    path.join(__dirname, '../bin', process.env.ENGINE)
  )

  await engine.init()

  log('engine ready')

  const routeHandler = graphqlHTTP({
    rootValue: getRoot(engine),
    graphiql: process.env.GRAPHIQL,
    schema
  })

  app.use('/', routeHandler)

  const port = process.env.PORT
  const server = app.listen(port)

  log(`accepting requests on port ${port}`)

  const shutdown = async () => {
    log('shutting down server...')
    await new Promise(resolve => server.close(resolve))
    await engine.quit()
  }

  return shutdown
}

module.exports = main

if (require.main == module) {
  try {
    main()
  } catch(err) {
    log(`failed to start due to error`)
    console.error(err)
  }
}
