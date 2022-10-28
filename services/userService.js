const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const JWT_SECRET = 'supersecret';
const SALT_ROUNDS = 10;


async function register(username, password) {
    if (username == undefined || password == undefined) {
        throw new Error('All fields are required!');
    }

    const existing = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });

    if (existing) {
        throw new Error('Username is taken!');
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);

    const user = await User.create({ username, hashedPassword });
    // const user = new User({ email, hashedPassword });
    // await user.save();

    // TODO see assignment if registration creates user session
    const token = createSession(user);

    return token;
}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });

    if (!user) {
        throw new Error('Incorrect username or password!');
    }

    const hasMatch = await compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect username or password!');
    }

    // token
    return createSession(user);
}

function createSession({ _id, username }) {
    const payload = { _id, username };
    const token = jwt.sign(payload, JWT_SECRET);

    return token;
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    verifyToken
};





// Idakiev

// const config = require('../config/config');
// const jwt = require('jsonwebtoken');
// const getJWT = require('../utils/get-jwt');
// const { jwtSecret } = config;

// module.exports = function (req, res, next) {
//     const token = getJWT(req);
//     if (!token) { next(); return; }
//     // check if this token is not in the blacklist database
//     jwt.verify(token, jwtSecret, function (err, decoded) {
//         if (err) { next(err); return; }
//         req.user = { _id: decoded.userId };
//         res.locals.isLogged = !!req.user;
//         next();
//     });
// };


// userSchema.methods.comparePasswords = function (providedPassword) {
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(providedPassword, this.password, function (err, result) {
//             if (err) { reject(err); return; }
//             resolve(result);
//         });
//     });
// };


// module.exports = function globalErrorHandler(err, req, res, next) {
//     if (res.locals.validationErrorViewName) {
//         res.render(res.locals.validationErrorViewName, { errors: err, ...req.body });
//         return;
//     }
//     if (err.message === 'BAD_REQUEST') {
//         res.status(400);
//         return;
//     }
//     if (err.message === 'UNAUTHORIZED') {
//         res.redirect('/');
//         return;
//     }
// };


// module.exports = function setValidationErrorViewName(viewName) {
//     return function (req, res, next) {
//         res.locals.validationErrorViewName = viewName;
//         next();
//     };
// };


// const { validationResult } = require('express-validator');

// function handleValidationErrors(req, res, next) {
//     const validationRes = validationResult(req);
//     // if (!validationRes.isEmpty()) { next(validationRes.errors); return; }
//     if (!validationRes.isEmpty()) { next(validationRes.errors.array({ onlyFirstError: true })); return; }
//     next();
// }

// module.exports = handleValidationErrors;


// module.exports = function checkAuth(shouldBeAuthenticated) {
//     return function (req, res, next) {
//         const isNotAuthWhenAuthIsRequired = shouldBeAuthenticated && !req.user;
//         if (
//             (isNotAuthWhenAuthIsRequired) ||
//             (!shouldBeAuthenticated && req.user)
//         ) {
//             next(new Error('UNAUTHORIZED'));
//             return;
//             // res.redirect(isNotAuthWhenAuthIsRequired ? '/login' : '/');
//             // return;
//         }
//         next();
//     };
// };


// userSchema.pre('save', function (done) {
//     const user = this;
//     if (!user.isModified('password')) {
//         done();
//         return;
//     }
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//         if (err) { done(err); return; }
//         bcrypt.hash(user.password, salt, (err, hash) => {
//             if (err) { done(err); return; }
//             user.password = hash;
//             done();
//         });
//     });
// });


// global.__basedir = __dirname;

// const app = require('express')();
// const config = require('./config/config');
// const globalErrorHandler = require('./global-error-handler');

// require('./config/express')(app);
// require('./config/routes')(app);
// const dbConnectionPromise = require('./config/database')();

// dbConnectionPromise.then(() => {
//   app.use(globalErrorHandler); // this should be always in the bottom (smiley)
//   app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
// });
