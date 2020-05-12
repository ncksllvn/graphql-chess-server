require('dotenv').config()

const fs = require('fs');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const engine = require('./utilities/engine')
const Game = require('./models/Game')

const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

async function main() {
  const app = express()

  await engine.initialize()

  app.use('/',
    graphqlHTTP({
      graphiql: true,
      schema,
      rootValue: {
        game({ fen }) {
          return new Game(fen, engine)
        },
        makeMove({ input: { fen, move } }) {
          const game = new Game(fen, engine)
          game.move(move)
          return game
        }
      },
    })
  )

  app.listen(4000);
}

module.exports = main

if (require.main) module.exports();
