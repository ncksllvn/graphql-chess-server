require('dotenv').config()

const express = require('express');

async function main() {
  const app = express();

  app.use('/game', await require('./routes/game')())
  app.use('/', require('./routes/index'))
  app.listen(4000);
}

module.exports = main

if (require.main) module.exports();
