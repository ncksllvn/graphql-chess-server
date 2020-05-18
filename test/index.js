const fs = require('fs')
const path = require('path')
const assert = require('assert').strict
const jsonSchema = require('json-schema')
const fetch = require('node-fetch')
const startServer = require('../src')

async function sendRequest(fileName) {
  const api = `http://localhost:${process.env.PORT}`
  const body = fs.readFileSync(
    path.join(__dirname, 'requests', `${fileName}.graphql`)
  ).toString()

  const response = await fetch(api, {
    body,
    method: 'POST',
    headers: {'Content-Type': 'application/graphql'}
  })

  return response.json()
}

function getSchema(fileName) {
  const rawString = fs.readFileSync(
    path.join(__dirname, 'schemas', `${fileName}.json`)
  ).toString()

  return JSON.parse(rawString)
}

async function queryChessSchema() {
  const json = await sendRequest('chess')
  assert.equal(json.error, undefined, 'No errors are present')

  const schema = getSchema('chess')
  const result = jsonSchema.validate(json, schema)
  assert.ok(result.valid, 'Response matches the Chess JSON Schema')
}

async function queryConstantsSchema() {
  const json = await sendRequest('constants')
  assert.equal(json.errors, undefined, 'No errors are present')

  const schema = getSchema('constants')
  const result = jsonSchema.validate(json, schema)
  assert.ok(result.valid, 'Response matches the Constants JSON Schema')
}

async function queryAnalysisSchema() {
  const json = await sendRequest('analysis')
  assert.equal(json.errors, undefined, 'No errors are present')

  const schema = getSchema('analysis')
  const result = jsonSchema.validate(json, schema)
  assert.ok(result.valid, 'Response matches the Analysis JSON Schema')
}

async function mutateMoveSchema() {
  const json = await sendRequest('move')
  assert.equal(json.errors, undefined, 'No errors are present')

  const formatted = {
    data: {
      chess: json.data.move
    }
  }

  const schema = getSchema('chess')
  const result = jsonSchema.validate(formatted, schema)
  assert.ok(result.valid, 'Response matches the Chess JSON Schema')
}

async function main() {
  const serverStarting = startServer()

  await assert.doesNotReject(serverStarting, 'The server starts')
  const shutdown = await serverStarting

  await queryChessSchema()
  await queryConstantsSchema()
  await queryAnalysisSchema()
  await mutateMoveSchema()

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
