var { GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString } = require('graphql');


const createSchema = (client) => {
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
      
      const MutationType = new GraphQLObjectType({
          name: 'Mutation',
          fields: () => ({
              createRecipe: {
                  type: RecipeType,
                  args: {
                  },
                  resolve: (root, args) => {
                      client.query(
                          `INSERT INTO recipes
                          (recipe_name, ingredients, directions)
                          VALUES
                          ('Steak frites', 'steak', 'cook it')`
                      ).then(res => {
                          console.log("added steak frites");
                      }).catch(e => console.error(e));
                  }
              }
          })
      });
      
      return new GraphQLSchema({
        query: QueryType,
        mutation: MutationType,
      });
}


exports.createSchema = createSchema;