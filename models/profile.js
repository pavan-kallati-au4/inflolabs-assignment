const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Profile = sequelize.define(
  "profile",
  {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    displayName: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    verifiedAt: Sequelize.DATE,
    role: {
      type: Sequelize.ENUM,
      values: ["ADMIN", "USER", "SYSTEM"],
      defaultValue: "USER",
    },
    status: {
      type: Sequelize.ENUM,
      values: ["VALID", "BLOCKED"],
      defaultValue: "VALID",
    },
    moderatedBy: {
      type: Sequelize.UUID,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Profile;
