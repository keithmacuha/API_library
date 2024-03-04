const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const verify = async (req, res, next) => {
    let token;

    token =req.cookies.jwt;

    if  (!token) {
        return res.status(401).json({ error: 'Token does not exists' });
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded_token.user_id);

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verify;