const Profile = require('../../models/profile');
const Report = require('../../models/report');
const { Op } = require("sequelize");

module.exports = {

    Query: {

        getAllReportedProfiles: async function (parent, { limit, skip }, context, info) {
            const reports = await Report.findAll({ limit, offset: skip, where: { reportedProfile: { [Op.ne]: null } } });
            if (!reports) {
                const error = new Error('No Reported Profile Found');
                error.code = 404;
                throw error;
            }
            return reports;
        },
    },


    Mutation: {
        reportProfile: async function (parent, { userId, description, reportedProfile }) {
            const reporter = await Profile.findByPk(userId);

            if (userId === reportedProfile) {
                const error = new Error('Reporting own profile');
                error.code = 404;
                throw error;
            }
            console.log(reporter);
            if (!reporter) {
                const error = new Error('Invalid User');
                error.code = 404;
                throw error;
            }
            // console.log("REPORTER", reporter);

            const profile = await Profile.findByPk(reportedProfile);
            if (!profile) {
                const error = new Error('Invalid Reporting User');
                error.code = 404;
                throw error;
            }
            // console.log("PROFILE", profile)

            const alreadyReported = await Report.findOne({
                where: { [Op.and]: [{ userId }, { reportedProfile }, { reportedPost: null }] }
            });
            if (alreadyReported) {
                const error = new Error('User already reported the profile');
                error.code = 400;
                throw error;
            }
            const result = await profile.createReport({ userId, description });
            if (!result) return false;
            return true;
        },

        moderateUser: async function (parent, { userId, status, moderatedBy }) {
            if (userId === moderatedBy) {
                const error = new Error("userId and Moderator Id can't be same");
                error.code = 400;
                throw error;
            }
            const user = await Profile.findByPk(userId);
            if (!user) {
                const error = new Error('No User Found');
                error.code = 404;
                throw error;
            }

            const moderator = await Profile.findByPk(moderatedBy);
            if (!moderator) {
                const error = new Error('No Moderator Found');
                error.code = 404;
                throw error;
            }

            if (moderator.role === 'USER') {
                const error = new Error('Invalid moderator');
                error.code = 403;
                throw error;
            }

            const result = await user.update({ status, moderatedBy });
            if (!result) return false;
            return true;
        },
        //Filler function
        createProfile: async function (parent, { username, displayName, email, role }) {
            const usernameExists = await Profile.findOne({ where: { username } });
            console.log(usernameExists)
            if (usernameExists) {
                const error = new Error('Username is not available');
                error.code = 403;
                throw error;
            }

            const emailExists = await Profile.findOne({ where: { email } });
            if (emailExists) {
                const error = new Error('Email is already registered');
                error.code = 403;
                throw error;
            }

            const profile = await Profile.create({ username, displayName, email, role });
            const result = await profile.save()
            if (!result) return false;
            return true;
        },
    },

    ReportedProfile: {
        profile: async function ({ reportedProfile }, args, context) {
            if (!reportedProfile) return null;
            return context.profileLoader.load(reportedProfile);

        },
        item: async function ({ reportedPost }, args, context) {
            if (!reportedPost) return null;
            return context.postLoader.load(reportedPost);
        },
    }

};