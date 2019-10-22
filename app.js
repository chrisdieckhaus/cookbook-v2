const express = require('express');
var graphqlHTTP = require('express-graphql');
var { GraphQlSchema,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  buildSchema } = require('graphql');
const { Client } = require('pg');

const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    recipe_id: {type: GraphQLInt},
    recipe_name: {type: GraphQLString},
    ingredients: {type: GraphQLString},
    description: {type: GraphQLString},
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    recipe: {
      type: RecipeType,
      args: {
        recipe_id: {type: GraphQLInt}
      },
      resolve: (root, args) => {
        return client.query('SELECT * FROM recipes')
        .then(res => res.rows)
        .catch((e) => console.log(e));
      } 
    }
  })
});

const schema =  new GraphQLSchema({
  query: QueryType
})

const app = express();
const port = 8080;

app.use(graphqlHTTP({
  schema,
  graphiql: true
}))

const client = new Client();
client.connect();


app.get('/recipes', (request, response) => 
{
    client.query('SELECT * FROM recipes')
        .then(res => {
            response.status(200).send(res.rows);
        })
        .catch(e => console.error(e.stack));
});


app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));