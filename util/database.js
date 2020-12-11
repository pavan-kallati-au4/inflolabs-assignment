const config = require('config');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.get('DB_NAME'),
    config.get('DB_USER'), config.get('DB_PSWD'),
    {
        dialect: config.get('DB_TYPE'),
        host: config.get('DB_HOST')
    });

module.exports = sequelize;