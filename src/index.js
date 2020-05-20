require('dotenv').config()

const fs = require('fs')
const path = require('path')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const Engine = require('./utilities/engine')

const log = require('./utilities/log')('server')
const getRoot = require('./root')

async function main() {
  const app = express()
  const schema = buildSchema(
    fs.readFileSync(
      path.join(__dirname, 'schema.graphql')
    ).toString()
  )

  const engine = new Engine()
  await engine.initialize()

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

if (require.main == module) {
  try {
    log(`beginning startup`)
    main()
  } catch(err) {
    log(`failed to start due to error`)
    console.error(err)
  }
}

module.exports = main
