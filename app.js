const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

// const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolver');
const db = require('./util/database');

const Profile = require('./models/profile');
const Post = require('./models/post');
const Report = require('./models/Report');

const models = require('./graphql/schema');

const server = new ApolloServer({
    typeDefs: models, resolvers: graphQLResolver
});

server.applyMiddleware({ app, path: '/graphql' });

Profile.hasMany(Post, {
    foreignKey: 'userId'
});
Report.belongsTo(Profile, {
    foreignKey: 'userId'
});
Report.belongsTo(Profile, {
    foreignKey: 'reportedProfile'
});
Profile.hasMany(Report, {
    foreignKey: 'userId'
});
Profile.hasMany(Report, {
    foreignKey: 'reportedProfile'
});
Post.belongsTo(Profile, {
    foreignKey: 'userId'
});
Report.belongsTo(Post, {
    foreignKey: 'reportedPost'
});

db.sync({ force: true }).then(async () => {
    // const currentUser = await Profile.findByPk(1);
    // console.log(Object.keys(currentUser.__proto__));
    await Profile.create({
        userId: 1,
        username: 'Pavan',
        displayname: 'Pavan',
        email: 'pavan@gmail.com',
        role: 'USER',
        status: 'VALID',
        moderatedBy: 'ADMIN'
    });
    await Profile.create({
        userId: 2,
        username: 'Bhawani',
        displayname: 'Bhawani',
        email: 'bhawani@gmail.com',
        role: 'ADMIN',
        status: 'BLOCKED',
        moderatedBy: 'ADMIN'
    });
    await Profile.create({
        userId: 3,
        username: 'Rishav',
        displayname: 'Rishav',
        email: 'rishav@gmail.com',
        role: 'ADMIN',
        status: 'BLOCKED',
        moderatedBy: 'ADMIN'
    });
    await Post.create({
        id: 1,
        body: 'Hello All, How are you?',
        isPrivate: true,
        status: 'VALID',
        moderatedBy: 'USER',
        userId: 2,
    });
    await Post.create({
        id: 2,
        body: 'Hello All,2nd Post',
        isPrivate: true,
        status: 'VALID',
        moderatedBy: 'USER',
        userId: 1,
    });
    await Report.create({
        description: 'Bad post',
        userId: 1,
        reportedProfile: 2,
        postId: 2
    });
});


app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));