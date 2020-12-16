const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const { POST: POST_DEFS } = require('../util/db-defs');

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
    values: POST_DEFS.POST_STATUSES,
    defaultValue: POST_DEFS.POST_STATUS_VALID
  },
  deletedAt: {
    type: Sequelize.DATE,
  },

}, { timestamps: true });


module.exports = Post;