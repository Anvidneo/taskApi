const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { keyJwt } = require('../settings/keys');
const User = require('../models/User');
const bcrypt = require("bcrypt");

router.post('/', async (req, res) => {
    let status = 200;
    let response = {};
    try {
        let { username, password } = req.body;
    
        let user = await User.findOne({ where: { username: username } });
        if (!user) {
            status = 404;
            response = {
                message: "User not found"
            };
        }
    
        if (user) {
            let compare = bcrypt.compareSync(password, user.password);
            if (!compare) {
                status = 404;
                response = {
                    message: "Incorrect password"
                };
            }
        
            if (status != 404) {
                const payload = {
                    check:true
                }
            
                const token = jwt.sign(payload, keyJwt, {
                    expiresIn:'7d'
                });
            
                await User.upsert({
                    id: user.id,
                    token,
                    updatedAt: Date.now()
                });
            
                response = {
                    message: 'Login successfuly',
                    token
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

module.exports = router;
