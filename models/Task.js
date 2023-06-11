const { DataTypes } = require('sequelize');
const db = require('../db/database');

const Task = db.define('tasks', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    iduser: {
        type: DataTypes.BIGINT
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE   
    }
});

module.exports = Task