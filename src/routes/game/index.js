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

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides the top-level API endpoints
const root = {
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  }
}

module.exports = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});
