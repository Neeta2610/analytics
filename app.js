const express = require('express');
const path = require('path');
const requestIp = require('request-ip');
const backendRoutes = require('./routes/backend.js');
const config = require('./config.json');
const app = express();
const db = require('./utils/database');
var ejs = require("ejs").__express;
app.use(requestIp.mw());
app.use('/api/v1', backendRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine(".ejs", ejs);
// require('hbs').registerHelper('toJson', data => JSON.stringify(data));


// setup public folder
app.use("/api/v1", express.static(__dirname + '/public'));

db.mongoConnect((db) => {
    app.db = db;
    app.listen(config.port || 3000);
});

module.exports = app;
