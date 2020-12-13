const Profile = require('../../models/profile');
const Post = require('../../models/post');
const Report = require('../../models/report');

module.exports = {

    Query: {

        getAllReportedProfiles: async function (parent, { limit, skip }, context, info) {
            console.log("LIMIT", limit);
            console.log("SKIP", skip);
            console.log(parent)
            return [{ username: 'some username' }]
        }
    },
    Mutation: {
        reportProfile: async function (parent, { userId, description, reportedProfile }) {

            const moderator = await Profile.findByPk(userId);
            //On No User Exists
            if (!moderator) {
                const error = new Error('Invalid user');
                error.code = 404;
                throw error;
            }

            const profile = await Profile.findByPk(reportedProfile);
            //on No Profile exists
            if (!profile) {
                const error = new Error('No profile found');
                error.code = 404;
                throw error;
            }

            const reported = await moderator.createReport({ description, reportedProfile });

            profile.moderatedBy = moderator.userId;
            const savedProfile = await profile.save()

            if (!report || !savedProfile) return false;
            return true;

        },

        reportPost: async function (parent, { userId, description, reportedPost }) {

        },

        moderateUser: async function (parent, { userId, status, moderatedBy }) {
            console.log({ userId, status, moderatedBy })
            return true;
        },

        moderatePost: async function (parent, { postId, moderatedBy, status }) {

        }

    }
}