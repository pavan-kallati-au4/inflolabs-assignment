const { ApolloServer } = require('apollo-server-express');
const Sequelize = require('sequelize');
const DataLoader = require('dataloader')
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const db = require('./util/database');


const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolvers');


const Profile = require('./models/profile');
const Post = require('./models/post');
const Report = require('./models/report');

const server = new ApolloServer({
    typeDefs: graphQLSchema, resolvers: graphQLResolver,
    context: () => {
        return {
            profileLoader: new DataLoader(async keys => {
                const result = await Profile.findAll({ where: { userId: [keys] } })
                return keys.map(userId => result.find(profile => profile.userId === userId))
            }),
            postLoader: new DataLoader(async keys => {
                const result = await Post.findAll({ where: { id: [keys] } })
                return keys.map(postId => result.find(post => post.id === postId))
            }),
        }
    }
});

server.applyMiddleware({ app, path: '/graphql' });

// Profile.hasMany(Post, { foreignKey: 'userId' });
// Post.belongsTo(Profile, { foreignKey: 'userId', constraints: true, onDelete: "CASCADE" });

// Post.hasMany(Report, { foreignKey: { name: 'reportedPost', allowNull: true } });
// Report.belongsTo(Post, { foreignKey: { name: 'reportedPost', allowNull: true } });

// Profile.hasMany(Report, { foreignKey: { name: 'userId', allowNull: true } });
// Report.belongsTo(Profile, { foreignKey: { name: 'reportedProfile', allowNull: true } });

Profile.hasMany(Post, {
    foreignKey: 'userId', constraints: true, onDelete: "CASCADE"
});

Post.belongsTo(Profile, {
    foreignKey: 'userId'
});

Profile.hasMany(Report, {
    foreignKey: { name: 'reportedProfile', allowNull: true },
});

Report.belongsTo(Profile, {
    foreignKey: { name: 'reportedProfile', allowNull: true },
});

Report.belongsTo(Profile, { foreignKey: 'userId' });

Report.belongsTo(Post, {
    foreignKey: { name: 'reportedPost', allowNull: true }
});

Post.hasMany(Report, { foreignKey: { name: 'reportedPost', allowNull: true } })

db.sync(
    // { force: true }
)
    // .then(() => {
    //     return Profile.create({ userId: uuid(), username: 'bhawanishiv', email: 'bhawanishiv@gmail.com', displayName: 'Bhawnai' })
    // })
    // .then((result) => {
    //     return Profile.create({ userId: uuid(), username: 'pawan', email: 'pawan@gmail.com', displayName: 'Pawan' })
    // })
    .then(result => {

        app.listen(port, () => console.log(`Apollo Server is listening to port: ${port}`));
    })
