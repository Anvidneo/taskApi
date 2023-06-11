const { Sequelize } = require("sequelize");

const db = new Sequelize('tasks', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    }
);

module.exports = db;