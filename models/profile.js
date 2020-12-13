const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Profile = sequelize.define('profile', {
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
  },
  verifiedAt: Sequelize.DATE,
  role: {
    type: Sequelize.ENUM,
    values: ['ADMIN', 'USER', 'SYSTEM'],
  },
  status: {
    type: Sequelize.ENUM,
    values: ['VALID', 'BLOCKED']
  },
  moderatedBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, { timestamps: true });


module.exports = Profile;