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
  status: {
    type: Sequelize.ENUM,
    values: ['VALID', 'MODERATED']
  },
  moderatedBy: {
    type: Sequelize.STRING,
    allowNull: false
  },
  deletedAt: Sequelize.DATE,

});


module.exports = Post;