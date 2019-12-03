import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString } from 'graphql';
import { Client } from 'pg';

const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    recipe_id: {type: GraphQLInt},
    recipe_name: {type: GraphQLString},
    ingredients: {type: GraphQLString},
    directions: {type: GraphQLString},
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // TODO We could consider just making a 'recipes' endpoint with an optional id param
    recipe: {
      type: RecipeType,
      args: {
        recipe_id: {type: GraphQLInt}
      },
      resolve: (root, args) => {
        var recipeId = args.recipe_id;
        return client.query('SELECT * FROM recipes WHERE recipe_id = ' + recipeId)
          .then(res => res.rows[0])
          .catch((e) => console.log(e));
      } 
    },
    recipes: {
      type: new GraphQLList(RecipeType),
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

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

const client = new Client();
client.connect();

app.get('/', (request, response) => {
  response.status(200).send(`Go Nats ${process.env.PGUSER}`);
});

app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));