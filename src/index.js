require('dotenv').config()

const fs = require('fs');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const Game = require('./models/Game')
const getEngine = require('./utilities/engine')
const log = require('./utilities/log')('root')

const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

async function main() {
  const app = express()
  const engine = await getEngine()

  const rootValue = {
    game({ fen }) {
      log(`executing game with fen "${fen}"`)
      return new Game(fen, engine)
    },
    makeMove({ input: { fen, move } }) {
      log(`executing makeMove with fen "${fen}", move "${move}"`)
      const game = new Game(fen, engine)
      game.move(move)
      return game
    }
  }

  const routeHandler = graphqlHTTP({
    graphiql: true,
    schema,
    rootValue,
  })

  app.use('/', routeHandler)
  app.listen(4000)
}

module.exports = main

if (require.main) module.exports();
