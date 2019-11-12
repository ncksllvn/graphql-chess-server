const fs = require('fs');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const Engine = require('uci')

const config = require('../../config')

const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

const Game = require('./Game')

async function gameController() {
  const engine = new Engine(config.ENGINE)

  await engine.runProcess()

  const root = {
    getDie: function ({numSides}) {
      return new Game(numSides || 6);
    }
  }

  return graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  });
}

module.exports = gameController
