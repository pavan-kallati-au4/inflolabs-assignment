const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post', {

  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  moderatedBy: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM,
    values: ['VALID', 'MODERATED'],
    defaultValue: 'VALID'
  },
  deletedAt: {
    type: Sequelize.DATE,
  },

}, { timestamps: true });


module.exports = Post;