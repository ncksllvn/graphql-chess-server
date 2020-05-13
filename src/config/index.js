const path = require('path');
const log = require('../utilities/log')('config')

const config = {
  ENGINE: path.join(__dirname, '../../bin', process.env.ENGINE)
}

log(config)

module.exports = config
