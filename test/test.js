const fs = require('fs')
const assert = require('assert').strict
const path = require('path')
const { Validator } = require('jsonschema')
const fetch = require('node-fetch')
const startServer = require('../src')

const jsonSchemaValidator = new Validator()

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

function assertMatchesSchema(instance, schema) {
  const result = jsonSchemaValidator.validate(instance, schema)
  if (result.errors.length) {
    throw result.errors
  }
}

let shutdown = null

before(async () => {
  shutdown = await startServer()
})

after(async () => {
  await shutdown()
})

describe('schemas/chess', () => {
  it('matches the JSON schema', async () => {
    const json = await sendRequest('chess')
    const schema = getSchema('chess')
    assertMatchesSchema(json, schema)
  })
})

describe('schemas/constants', () => {
  it('matches the JSON schema', async () => {
    const json = await sendRequest('constants')
    const schema = getSchema('constants')
    assertMatchesSchema(json, schema)
  })
})

describe('schemas/analysis', () => {
  it('matches the JSON schema', async () => {
    const json = await sendRequest('analysis')
    const schema = getSchema('analysis')
    assertMatchesSchema(json, schema)
  })
})

describe('schemas/mutations/move', () => {
  it('matches the JSON schema', async () => {
    const json = await sendRequest('move')

    const formatted = {
      data: {
        chess: json.data.move
      }
    }

    const schema = getSchema('chess')
    assertMatchesSchema(formatted, schema)
  })
})
