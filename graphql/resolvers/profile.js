const Profile = require("../../models/profile");
const Report = require("../../models/report");
const { Op } = require("sequelize");
let { v4: uuid } = require("uuid");

module.exports = {
  Query: {
    getAllReportedProfiles: async function (
      parent,
      { limit, skip },
      context,
      info
    ) {
      const reports = await Report.findAll({
        limit,
        offset: skip,
        where: { reportedProfile: { [Op.ne]: null } },
      });
      if (!reports) {
        const error = new Error("No Reported Profile Found");
        error.code = 404;
        throw error;
      }
      return reports;
    },
  },

  Mutation: {
    reportProfile: async function (
      parent,
      { userId, description, reportedProfile }
    ) {
      const reporter = await Profile.findByPk(userId);
      if (!reporter) {
        const error = new Error("Invalid User");
        error.code = 404;
        throw error;
      }
      // console.log("REPORTER", reporter);

      const profile = await Profile.findByPk(reportedProfile);
      if (!profile) {
        const error = new Error("Invalid Reporting User");
        error.code = 404;
        throw error;
      }
      // console.log("PROFILE", profile)

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
        const error = new Error("No User Found");
        error.code = 404;
        throw error;
      }

      const moderator = await Profile.findByPk(moderatedBy);
      if (!moderator) {
        const error = new Error("No Moderator Found");
        error.code = 404;
        throw error;
      }

      if (moderator.role === "USER") {
        const error = new Error("Invalid moderator");
        error.code = 403;
        throw error;
      }

      const result = await user.update({ status, moderatedBy });
      if (!result) return false;
      return true;
    },
    //Filler function
    createProfile: async function (
      parent,
      { username, displayName, email, role }
    ) {
      const userId = uuid();
      const profileExists = await Profile.findOne({ email: email });
      //   console.log(profileExists);
      if (!profileExists) {
        const profile = await Profile.create({
          userId,
          username,
          displayName,
          email,
          role,
        });
        const result = await profile.save();
        if (!result) return false;
        return true;
      } else {
        throw new Error("Profile already present!");
      }
    },
  },

  ReportedProfile: {
    profile: async function ({ reportedProfile }, args, context) {
      return context.profileLoader.load(reportedProfile);
    },
    item: async function ({ reportedPost }, args, context) {
      return context.postLoader.load(reportedPost);
    },
  },
};
