const path = require('path');

const config = {
  ENGINE: path.join(__dirname, '../../bin', process.env.ENGINE)
}

module.exports = config
