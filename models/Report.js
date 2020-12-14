const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Report = sequelize.define('report', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, { timestamps: true });


module.exports = Report;