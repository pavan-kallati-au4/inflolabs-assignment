const config = require('config');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolver');

const server = new ApolloServer({
    typeDefs: graphQLSchema, resolvers: graphQLResolver
});

server.applyMiddleware({ app, path: '/graphql' });
 

app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));