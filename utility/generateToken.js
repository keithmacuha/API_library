const jwt = require('jsonwebtoken');

const generate = (res, user_id) => {
    const token = jwt.sign({user_id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 1000
    });
}

module.exports = generate;