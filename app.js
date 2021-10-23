const express = require('express');
const path = require('path');
const requestIp = require('request-ip');
const backendRoutes = require('./routes/backend.js');
const config = require('./config.json');
const app = express();
const db = require('./utils/database');
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(requestIp.mw());
app.use('/api/v1', backendRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
require('hbs').registerHelper('toJson', data => JSON.stringify(data));
app.set('view engine', 'hbs');

db.mongoConnect((db) => {
    app.db = db;
    app.listen(config.port || 3000);
});

module.exports = app;
