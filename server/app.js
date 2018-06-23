/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * @license MIT
 */

require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('schema');

const { debugNs } = require('config');
const debug = require('debug')(`${debugNs}:server-app`);

/* Check for MongoDB URI */
process.env.MONGODB_URI ? null : process.exit(1);

/* Connect to mLab DB */
mongoose.connect(process.env.MONGODB_URI).catch((err) => {
  debug('Could not connect to MongoDB instance on mLab');
  debug(err.message);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  debug('Connected to mLab Database');
});

/* Port */
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  debug('Server started at port', PORT);
});
