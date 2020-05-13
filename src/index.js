require('dotenv').config()

const fs = require('fs');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const getRoot = require('./root')

const schema = buildSchema(
  fs.readFileSync(
    path.join(__dirname, 'schema.graphql')
  ).toString()
)

async function main() {
  const app = express()
  const routeHandler = graphqlHTTP({
    rootValue: await getRoot(),
    graphiql: true,
    schema
  })

  app.use('/', routeHandler)
  app.listen(4000)
}

module.exports = main

if (require.main) module.exports();
