const express = require('express');
const app = express();

app.use('/', require('./routes/index'))
app.use('/game', require('./routes/game'))

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');
