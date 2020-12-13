const Profile = require('../../models/profile');
const Post = require('../../models/post');
let { v4: uuid } = require('uuid');

module.exports = {

    Query: {
        getAllReportedPosts: async function (parent, { limit, skip }, context, info) {
            console.log("LIMIT", limit)
            console.log("SKIP", skip)
            console.log(parent)
            return [{ body: 'some post body' }]
        },
    },

    Mutation: {

        createPost: async function (parent, { userId, body, isPrivate }) {
            const user = await Profile.findByPk(userId);
            if (!user) {
                const error = new Error('Invald user');
                error.code = 401;
                throw error;
            }

            const post = await user.createPost({ id: uuid(), body, isPrivate });

            console.log(post);
            return true;

        },
        moderatePost: async function (parent, { postId, moderatedBy, status }) { }
    },
}