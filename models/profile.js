const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Profile = sequelize.define('profile', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  displayname: Sequelize.STRING,
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
    allowNull: false,
  }
});


module.exports = Profile;