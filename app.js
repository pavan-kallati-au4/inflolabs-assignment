const config = require('config');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolver');

const Profile = require('./models/profile');
const Post = require('./models/post');

const server = new ApolloServer({
    typeDefs: graphQLSchema, resolvers: graphQLResolver
});

server.applyMiddleware({ app, path: '/graphql' });

Profile.hasMany(Post);

app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));