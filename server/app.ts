import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { Client } from 'pg';
import {createSchema} from './graphql-schema/recipes';

const app = express();
const port = 8080;


const client = new Client();
client.connect();

app.use('/graphql', graphqlHTTP({
  schema: createSchema(client),
  graphiql: true
}))

app.use(express.static(__dirname +'../client')); //serves the index.html

app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));