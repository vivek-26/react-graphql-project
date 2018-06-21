/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * @license MIT
 */

require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('schema');

const { debugNs } = require('config');
const debug = require('debug')(`${debugNs}:server-app`);

/* Port */
const PORT = process.env.PORT || 3000;

const app = express();
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  debug('Server started at port', PORT);
});
