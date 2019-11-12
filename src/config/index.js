const path = require('path');

const CONFIG = {
  ENGINE: path.join(__dirname, '../engines', process.env.ENGINE)
}

module.exports = CONFIG
