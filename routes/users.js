const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
        jwt.verify(token, process.env.KEY, (error, decoded) => {
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

router.get('/', validationLogin, async (req, res) => {
    let status = 200;
    let response = {};
    try {
        const users = await User.findAll();
        if (!users) {
            status = 204;
            response = {
                error: 'Not data'
            };
        }

        response = {
            message: 'Users found',
            data: users
        };
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
        const { username, password, name, email } = req.body;
        if (!username || !password || !name || !email) {
            status = 400;
            response = {
                error: 'All params required'
            };
        }

        if (status != 400) {
            let pass = await bcrypt.hash(password, 10);
            const user = await User.create({
                username, 
                password: pass,
                name, 
                email, 
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
    
            if (!user) {
                status = 400;
                response = {
                    error: "User don't created"
                };
            } else {
                response = {
                    message:'User created',
                    user
                };
            }
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
        const { username, name, email, password } = req.body;
        if (!username || !password || !name || !email) {
            status = 400;
            response = {
                error: 'All params required'
            };
        }

        if (status != 400) {
            let pass = await bcrypt.hash(password, 10);
            const user = await User.upsert({
                id,
                username,
                password: pass,
                name,
                email,
                updatedAt: Date.now()
            });
    
            if (!user) {
                status = 401;
                response = {
                    error: "User don't update"
                };
            } else {
                response = {
                    message:'User updated',
                    user
                };
            }
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

        let user = await User.findByPk(id);

        if (!user) {
            status = 204;
            response = {
                error: 'User not found'
            };
        } else {
            response = {
                message: 'User found',
                user : {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
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

        if (!status ) {
            statusCode = 400;
            response = {
                error: 'All params required'
            };
        }

        if (statusCode != 400) {
            const user = await User.upsert({
                id,
                status,
                updatedAt: Date.now()
            });
    
            if (!user) {
                statusCode = 401;
                response = {
                    error: 'User not update'
                };
            } else {
                response = {
                    message:'User updated',
                    user
                };
            }
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

