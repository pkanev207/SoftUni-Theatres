const { verifyToken } = require('../services/userService');

module.exports = () => (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const userData = verifyToken(token);
            // console.log('Read successful, user >>>', userData);
            req.user = userData;
            res.locals.user = userData;
            res.locals.hasUser = true;
        } catch (err) {
            // console.log('Invalid token');
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        }
    }

    next();
};





// const jwt = require('jsonwebtoken');

// module.exports = (jwtSecret) => (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         try {
//             const data = jwt.verify(token, jwtSecret);
//             req.user = data;
//         } catch (err) {
//             res.clearCookie('jwt');
//             return res.redirect('/login');
//         }
//     }

//     req.signJwt = (data) => jwt.sign(data, jwtSecret, { expiresIn: '4h' });

//     next();
// };
