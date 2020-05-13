const debug = require('debug')

function log(suffix) {
  return debug(`chess-graphql:${suffix}`)
}

module.exports = log
