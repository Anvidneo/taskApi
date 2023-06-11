const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { keyJwt } = require('../settings/keys');
const Task = require('../models/Task');
const bcrypt = require("bcrypt");

let validationLogin = express.Router();
validationLogin.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        res.status(401).send({
            error:"Token don't provided"
        })
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, keyJwt, (error, decoded) => {
            if (error) {
                return res.json({
                    message:'Invalid token'
                })
            }
            req.decoded = decoded;
            next();
        });
    }
});

router.get('/user/:iduser', validationLogin, async (req, res) => {
    let status = 200;
    let response = {};
    try {
        const { iduser } = req.params;
        const { rows, count } = await Task.findAndCountAll({ where: { iduser: iduser } });
        if (count == 0) {
            status = 404;
            response = {
                error: 'Not data'
            };
        }

        if (status != 404) {
            response = {
                message: 'Tasks found',
                data: rows
            };
        }
    } catch (error) {
        status = 400;
        response = {
            error
        };
    }

    res.status(status).json(response);
});

router.post('/', async (req, res) => {
    let status = 200;
    let response = {};
    try {
        const { iduser, title, description } = req.body;
        if (!iduser || !title || !description) {
            status = 400;
            response = {
                error: 'All params required'
            };
        }
        
        const task = await Task.create({
            iduser, 
            title,
            description, 
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        if (!task) {
            status = 400;
            response = {
                error: "Task don't created"
            };
        } else {
            response = {
                message:'Task created',
                task
            };
        }
    } catch (error) {
        status = 400;
        response = {
            error
        };
    }

    res.status(status).json(response);
});

router.put('/:id', validationLogin, async (req, res) => {
    let status = 200;
    let response = {};
    try {
        const { id } = req.params;
        const { iduser, title, description } = req.body;
        if (!iduser || !title || !description) {
            status = 400;
            response = {
                error: 'All params required'
            };
        }
        
        const task = await Task.upsert({
            id,
            iduser, 
            title,
            description,
            updatedAt: Date.now()
        });

        if (!task) {
            status = 400;
            response = {
                error: "Task don't update"
            };
        } else {
            response = {
                message:'Task updated',
                task
            };
        }
    } catch (error) {
        status = 400;
        response = {
            error
        };
    }

    res.status(status).json(response);
});

router.get('/:id', validationLogin, async (req, res) => {
    let status = 200;
    let response = {};
    try {
        const { id } = req.params;

        let task = await Task.findByPk(id);

        if (!task) {
            status = 404;
            response = {
                error: 'Task not found'
            };
        } else {
            response = {
                message: 'Task found',
                task
            };
        }

    } catch (error) {
        status = 400;
        response = {
            error
        };
    }

    res.status(status).json(response);
});


router.put('/changeStatus/:id', validationLogin, async (req, res) => {
    let statusCode = 200;
    let response = {};
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.upsert({
            id,
            status,
            updatedAt: Date.now()
        });

        if (!task) {
            statusCode = 401;
            response = {
                error: 'Task not update'
            };
        } else {
            response = {
                message:'Task updated',
                task
            };
        }

    } catch (error) {
        statusCode = 400;
        response = {
            error
        };
    }

    res.status(statusCode).json(response);
});

module.exports = router;

