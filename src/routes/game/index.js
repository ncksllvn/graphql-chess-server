const fs = require('fs');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

const Game = require('./Game')

async function gameController() {
  const root = {
    getGame({ fen }) {
      return new Game(fen)
    },

    updateGame({ input: { fen, move } }) {
      const game = new Game(fen)
      game.move(move)
      return game
    }
  }

  return graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  });
}

module.exports = gameController
