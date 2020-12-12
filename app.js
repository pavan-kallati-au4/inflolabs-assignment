const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolver');
const db = require('./util/database');

const Profile = require('./models/profile');
const Post = require('./models/post');
const Report = require('./models/Report');

const server = new ApolloServer({
    typeDefs: graphQLSchema, resolvers: graphQLResolver
});

server.applyMiddleware({ app, path: '/graphql' });

Profile.hasMany(Post);
Report.belongsTo(Profile, {
    foreignKey: 'userId'
});
Report.belongsTo(Profile, {
    foreignKey: 'reportedProfile'
});
Report.belongsTo(Post);

db.sync({ force: true }).then(() => { });


app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));