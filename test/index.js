const fs = require('fs')
const path = require('path')
const assert = require('assert').strict
const jsonSchema = require('json-schema')
const fetch = require('node-fetch')
const startServer = require('../src')

const API_URL = `http://localhost:${process.env.PORT}`

function getSchema(fileName) {
  const rawString = fs.readFileSync(
    path.join(__dirname, 'schemas', `${fileName}.json`)
  ).toString()

  return JSON.parse(rawString)
}

async function queryChessSchema() {
  const graphql = fs.readFileSync(
    path.join(__dirname, 'requests/chess.graphql')
  ).toString()

  const response = await fetch(API_URL, {
    method: 'POST',
    body: graphql,
    headers: {'Content-Type': 'application/graphql'}
  })

  const json = await response.json()
  assert.equal(json.error, undefined, 'No errors are present')

  const schema = getSchema('chess')
  const result = jsonSchema.validate(json, schema)
  assert.ok(result.valid, 'Response matches the JSON Schema')
}

async function main() {
  const serverStarting = startServer()

  await assert.doesNotReject(serverStarting, 'The server starts')
  await queryChessSchema()

  const shutdown = await serverStarting
  const shuttingDown = shutdown()

  await assert.doesNotReject(shuttingDown, 'The server stops')
}

(async () => {
  try { await main() }
  catch(err) {
    console.error(err)
    process.exit(1)
  }
})()
