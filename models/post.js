const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post', {

  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  moderatedBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM,
    values: ['VALID', 'MODERATED']
  },
  deletedAt: {
    type: Sequelize.DATE,
  },

}, { timestamps: true});


module.exports = Post;