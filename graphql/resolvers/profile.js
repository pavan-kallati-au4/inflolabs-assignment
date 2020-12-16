const Profile = require("../../models/profile");
const Report = require("../../models/report");
const { Op } = require("sequelize");
const { POST: POST_DEFS, PROFILE: PROFILE_DEFS } = require('../../util/db-defs');
const { PROFILE_STATUS_VALID } = require("../../util/db-defs/profile");

module.exports = {
  Query: {
    getAllReportedProfiles: async function (parent, { limit, skip }, context, info) {
      const reports = await Report.findAll({ limit, offset: skip, where: { reportedProfile: { [Op.ne]: null } } });
      if (!reports) {
        const error = new Error("No Reported Profile Found");
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
        const error = new Error("Reporting own profile");
        error.code = 404;
        throw error;
      }
      // console.log(reporter);

      if (!reporter) {
        const error = new Error("Invalid User");
        error.code = 404;
        throw error;
      } else if (reporter.status === PROFILE_DEFS.PROFILE_STATUS_BLOCKED) {
        throw new Error("You're BLOCKED! Can't report a profile.");
      }
      // console.log("REPORTER", reporter);

      const profile = await Profile.findByPk(reportedProfile);
      if (!profile) {
        const error = new Error("Invalid Reporting User");
        error.code = 404;
        throw error;
      }
      // console.log("PROFILE", profile)

      const alreadyReported = await Report.findOne({ where: { [Op.and]: [{ userId }, { reportedProfile }, { reportedPost: null }], }, });
      if (alreadyReported) {
        const error = new Error("User already reported the profile");
        error.code = 400;
        throw error;
      }

      const result = await profile.createReport({ userId, description });
      if (!result) return false;
      return true;
    },

    moderateUser: async function (parent, { userId, status, moderatedBy }) {

      if (userId === moderatedBy) {
        const error = new Error("User and Moderator cannot be same");
        error.code = 400;
        throw error;
      }

      const user = await Profile.findByPk(userId);
      if (!user) {
        const error = new Error("No User found");
        error.code = 404;
        throw error;
      }

      const moderator = await Profile.findByPk(moderatedBy);
      if (!moderator) {
        const error = new Error("No Moderator found");
        error.code = 404;
        throw error;
      }

      let allowed = false;
      switch (moderator.role) {

        case PROFILE_DEFS.PROFILE_ROLE_SUPER_ADMIN:
          allowed = true;
          break;

        case PROFILE_DEFS.PROFILE_ROLE_ADMIN:
          if (user.role === PROFILE_DEFS.PROFILE_ROLE_USER)
            allowed = true;
          break;

        default:
          const error = new Error("Moderator do not have moderation right");
          error.code = 403;
          throw error;
      }

      if (!allowed) {
        const error = new Error("Moderator do not have moderation right");
        error.code = 403;
        throw error;
      }

      let newRole = user.role;
      if (user.role === PROFILE_DEFS.PROFILE_ROLE_ADMIN
        && status === PROFILE_DEFS.PROFILE_STATUS_BLOCKED) {
        newRole = PROFILE_DEFS.PROFILE_ROLE_USER
      }

      const result = await user.update({ role: newRole, status, moderatedBy });
      if (!result) return false;
      return true;

    },
    //Filler function
    createProfile: async function (parent, { username, displayName, email, role }) {
      const usernameExists = await Profile.findOne({ where: { username } });
      if (usernameExists) {
        const error = new Error("Username is not available");
        error.code = 403;
        throw error;
      }

      const emailExists = await Profile.findOne({ where: { email } });
      if (emailExists) {
        const error = new Error("Email is already registered");
        error.code = 403;
        throw error;
      }

      const profile = await Profile.create({ username, displayName, email, role });
      const result = await profile.save();
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
  },
};
