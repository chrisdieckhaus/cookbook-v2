const express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const { Client } = require('pg');

const app = express();
const port = 8080;

const client = new Client();
client.connect();

client.query('SELECT * FROM recipes', (err, res) => {
    console.log(res.rows)
    client.end()
})

var schema = buildSchema(`
  type Query {
    hello: String,
    Will: String
  }
`);

var root = { 
    hello: () => 'Hello cookbook! This is GraphQL.' ,
    Will: "Will is a guy"
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', (req, res) => res.send('Hello, Cookbook-v2! Check for graphql at /graphql'));
app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));