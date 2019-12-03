const express = require('express');
var graphqlHTTP = require('express-graphql');
const { Client } = require('pg');

const {createSchema} = require('./graphql_schema/recipes');

const app = express();
const port = 8080;


const client = new Client();
client.connect();

app.use('/graphql', graphqlHTTP({
  schema: createSchema(client),
  graphiql: true
}))

app.get('/', (request, response) => {
  response.status(200).send(`Go Nats ${process.env.PGUSER}`);
});

app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));