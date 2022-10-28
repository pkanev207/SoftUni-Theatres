const mongoose = require('mongoose');
// We should load all models here to create db
require('../models/User');

// TODO change database name
const dbName = 'theaters';
const CONNECTION_STRING = `mongodb://127.0.0.1:27017/${dbName}`;
// const CONNECTION_STRING = `mongodb://localhost:27017/${dbName}`;

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // autoIndex: false,
        });
        console.log('Database connected');

        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err);
        });
    } catch (err) {
        console.error('Error connecting to database');
        console.log(err);
        process.exit(1);
    }
};
