require('dotenv').config()

const fs = require('fs');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const getEngine = require('./utilities/engine')
const Game = require('./models/Game')

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
      return new Game(fen, engine)
    },
    makeMove({ input: { fen, move } }) {
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
