const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const userSession = require('../middleware/userSession');
const trimBody = require('../middleware/trimBody');

module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser()); // secret can be set here
    app.use(userSession());
    app.use(trimBody('password'));
};
