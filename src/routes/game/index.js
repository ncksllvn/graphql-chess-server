const fs = require('fs');
const path = require('path');

const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

const Game = require('./Game')

// The root provides the top-level API endpoints
const root = {
  getDie: function ({numSides}) {
    return new Game(numSides || 6);
  }
}

module.exports = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});
