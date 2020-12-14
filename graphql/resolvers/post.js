const Profile = require("../../models/profile");
const Post = require("../../models/post");
const Report = require("../../models/report");
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");

module.exports = {
  Query: {
    getAllReportedPosts: async function (
      parent,
      { limit, skip },
      context,
      info
    ) {
      const reports = await Report.findAll({
        limit,
        offset: skip,
        where: { reportedPost: { [Op.ne]: null } },
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

      const result = await post.createReport({
        userId,
        description,
        reportedProfile: post.userId,
      });
      if (!result) return false;
      return true;
    },

    moderatePost: async function (parent, { postId, moderatedBy, status }) {
      const moderator = await Profile.findByPk(moderatedBy);
      if (moderator.role === "ADMIN") {
        const post = await Post.findByPk(postId);
        if (!post) {
          throw new Error("Post unavilable!");
        }
        await post.update({ status, moderatedBy });
      } else {
        throw new Error("Not enough rights!");
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

      const post = await user.createPost({ id: uuid(), body, isPrivate });

      console.log(post);
      return true;
    },
  },

  ReportedPost: {
    item: async function ({ reportedPost }, args, context) {
      return context.postLoader.load(reportedPost);
    },
    profile: async function ({ reportedProfile }, args, context) {
      return context.profileLoader.load(reportedProfile);
    },
  },
};
