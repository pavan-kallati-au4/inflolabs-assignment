const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  moderatedBy: {
    type: Sequelize.ENUM,
    values: ['VALID', 'MODERATED']
  },
  deletedAt: {
    type: Sequelize.DATE,
  }
});


module.exports = Post;