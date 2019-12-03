"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var graphqlHTTP = require("express-graphql");
var graphql_1 = require("graphql");
var pg_1 = require("pg");
var RecipeType = new graphql_1.GraphQLObjectType({
    name: 'Recipe',
    fields: function () { return ({
        recipe_id: { type: graphql_1.GraphQLInt },
        recipe_name: { type: graphql_1.GraphQLString },
        ingredients: { type: graphql_1.GraphQLString },
        directions: { type: graphql_1.GraphQLString },
    }); }
});
var QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: function () { return ({
        // TODO We could consider just making a 'recipes' endpoint with an optional id param
        recipe: {
            type: RecipeType,
            args: {
                recipe_id: { type: graphql_1.GraphQLInt }
            },
            resolve: function (root, args) {
                var recipeId = args.recipe_id;
                return client.query('SELECT * FROM recipes WHERE recipe_id = ' + recipeId)
                    .then(function (res) { return res.rows[0]; })
                    .catch(function (e) { return console.log(e); });
            }
        },
        recipes: {
            type: new graphql_1.GraphQLList(RecipeType),
            resolve: function (root, args) {
                return client.query('SELECT * FROM recipes')
                    .then(function (res) { return res.rows; })
                    .catch(function (e) { return console.log(e); });
            }
        }
    }); }
});
var schema = new graphql_1.GraphQLSchema({
    query: QueryType
});
var app = express();
var port = 8080;
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
var client = new pg_1.Client();
client.connect();
app.get('/', function (request, response) {
    response.status(200).send("Go Nats " + process.env.PGUSER);
});
app.listen(port, function () { return console.log("Cookbook listening on port " + port + "!"); });
