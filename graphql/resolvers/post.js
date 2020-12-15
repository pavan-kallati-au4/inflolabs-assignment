const Profile = require("../../models/profile");
const Post = require("../../models/post");
const Report = require("../../models/report");
const { Op } = require("sequelize");
const { UserInputError } = require("apollo-server");

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

      const post = await Post.findByPk(reportedPost);
      if (!post) {
        const error = new Error("Invalid Reporting Post");
        error.code = 404;
        throw error;
      }
      // console.log("POST", post)

      const alreadyReported = await Report.findOne({
        where: { [Op.and]: [{ userId }, { reportedPost }] }
      });

      if (alreadyReported) {
        const error = new Error("User already reported the Post");
        error.code = 400;
        throw error;
      }

      const result = await post.createReport({ userId, description });

      if (!result) return false;
      return true;
    },

    moderatePost: async function (parent, { postId, moderatedBy, status }) {
      const moderator = await Profile.findByPk(moderatedBy);

      if (!moderator) {
        throw new UserInputError("Moderator not present!", {});
      } else if (moderator.role === "ADMIN") {
        const post = await Post.findByPk(postId);
        if (!post) {
          throw new Error("Post unavilable!");
        }
        await post.update({ status, moderatedBy });
      } else {
        throw new UserInputError("Not enough rights!");
      }
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
    profile: async function ({ reportedProfile }, args, context) {
      if (!reportedProfile) return null;
      return context.profileLoader.load(reportedProfile);
    },
  },
};
