const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const { PROFILE:PROFILE_DEFS} = require('../util/db-defs');

const Profile = sequelize.define(
  "profile",
  {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
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
      values: PROFILE_DEFS.PROFILE_ROLES,
      defaultValue: PROFILE_DEFS.PROFILE_ROLE_USER,
    },
    status: {
      type: Sequelize.ENUM,
      values: PROFILE_DEFS.PROFILE_STATUSES,
      defaultValue: PROFILE_DEFS.PROFILE_STATUS_VALID,
    },
    moderatedBy: {
      type: Sequelize.UUID,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Profile;
