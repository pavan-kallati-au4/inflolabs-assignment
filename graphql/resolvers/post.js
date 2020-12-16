const Profile = require("../../models/profile");
const Post = require("../../models/post");
const Report = require("../../models/report");
const { Op } = require("sequelize");
const { UserInputError } = require("apollo-server");
const { POST: POST_DEFS, PROFILE: PROFILE_DEFS } = require('../../util/db-defs');

module.exports = {
  Query: {
    getAllReportedPosts: async function (parent, { limit, skip }, context, info) {
      const reports = await Report.findAll({ limit, offset: skip, where: { reportedPost: { [Op.ne]: null } }, });
      if (!reports) {
        const error = new Error("No Reported Profile Found");
        error.code = 404;
        throw error;
      }
      return reports;
    },
  },

  Mutation: {
    reportPost: async function (parent, { userId, description, reportedPost }) {

      const reporter = await Profile.findByPk(userId);
      if (!reporter) {
        const error = new Error("Invalid User");
        error.code = 404;
        throw error;
      }
      // console.log("REPORTER", reporter);
      else if (reporter.status === PROFILE_DEFS.PROFILE_STATUS_BLOCKED) {
        throw new Error("You're BLOCKED! Don't have permission to report a post.")
      }

      const post = await Post.findByPk(reportedPost);
      if (!post) {
        const error = new Error("Invalid Reporting Post");
        error.code = 404;
        throw error;
      }

      // console.log("POST", post)

      if (post.userId === userId) {
        const error = new Error("Cannot report own post");
        error.code = 403;
        throw error;
      }

      // console.log("PRIVATE_POST", post.isPrivate)
      if (post.isPrivate) {
        const error = new Error("Reporting not allowed");
        error.code = 405;
        throw error;
      }

      const alreadyReported = await Report.findOne({
        where: { [Op.and]: [{ userId }, { reportedPost }] }
      });

      if (alreadyReported) {
        const error = new Error("User already reported the Post");
        error.code = 400;
        throw error;
      }

      const result = await post.createReport({ userId, description, reportedProfile: post.userId });

      if (!result) return false;
      return true;
    },

    moderatePost: async function (parent, { postId, moderatedBy, status }) {

      const moderator = await Profile.findByPk(moderatedBy);

      if (!moderator) {
        throw new UserInputError("Moderator not present!", {});
      }
      if (moderator.role !== PROFILE_DEFS.PROFILE_ROLE_ADMIN &&
        moderator.role !== PROFILE_DEFS.PROFILE_ROLE_SUPER_ADMIN) {
        throw new UserInputError("Not enough rights!");
      }

      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("Post unavilable!");
      }

      if (post.userId === moderatedBy) {
        throw new UserInputError('Cannot moderate own post');
      }

      const result = await post.update({ status, moderatedBy });
      if (!result) return false;
      return true;

    },
    //Filler function
    createPost: async function (parent, { userId, body, isPrivate }) {
      const user = await Profile.findByPk(userId);

      if (!user) {
        const error = new Error("Invald user");
        error.code = 401;
        throw error;
      }

      if (user.status === PROFILE_DEFS.PROFILE_STATUS_BLOCKED) {
        throw new Error("You're BLOCKED! Can't create a post.");
      }

      const post = await user.createPost({ body, isPrivate });

      if (!post) return false;

      return true;
    },
  },

  ReportedPost: {
    item: async function ({ reportedPost }, args, context) {
      if (!reportedPost) return null;
      return context.postLoader.load(reportedPost);
    },
    profile: async function ({ reportedProfile, userId }, args, context) {
      console.log(userId + '->' + reportedProfile);
      if (!reportedProfile) return null;
      return context.profileLoader.load(reportedProfile);
    },
  },
};
