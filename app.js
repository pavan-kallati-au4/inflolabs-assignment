const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const Sequelize = require('sequelize');
const db = require('./util/database');


const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolvers');


const Profile = require('./models/profile');
const Post = require('./models/post');
const Report = require('./models/report');

const server = new ApolloServer({
    typeDefs: graphQLSchema, resolvers: graphQLResolver
});

server.applyMiddleware({ app, path: '/graphql' });

Post.belongsTo(Profile, { foreignKey: 'userId', constraints: true, onDelete: "CASCADE" });
Profile.hasMany(Post, { foreignKey: 'userId' });


db.sync(
    { force: true }
).then(() => {
    app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));
});
