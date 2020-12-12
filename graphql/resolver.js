const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

module.exports = {

    Query: {
        getAllReportedPosts: async function (parent, { limit, skip }, context, info) {

            console.log("LIMIT", limit)
            console.log("SKIP", skip)
            console.log(parent)
            return [{ body: 'some post body' }]
        },
        getAllReportedProfiles: async function (parent, { limit, skip }, context, info) {
            console.log("LIMIT", limit);
            console.log("SKIP", skip);
            console.log(parent)
            return [{ username: 'some username' }]
        }
    },
    Mutation: {
        reportProfile: async function (parent, { userId, description, reportedProfile }) {

        },

        reportPost: async function (parent, { userId, description, reportedPost }) {

        },

        moderateUser: async function (parent, { userId, status, moderatedBy }) {
            console.log({ userId, status, moderatedBy })
            return true;
        },

        moderatePost: async function (parent, { postId, moderatedBy, status }) {

        }

    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value)
        },
        serialize(value) {
            return value.getTime()
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
            return null;
        }
    })
}