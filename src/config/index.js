const path = require('path');

const config = {
  ENGINE: path.join(__dirname, '../engines', process.env.ENGINE)
}

module.exports = config
