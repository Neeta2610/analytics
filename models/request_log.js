let mongoose = require('mongoose');

let RequestLog = mongoose.model('RequestLog', {
    url: String,
    method: String,
    responseTime: Number,
    day: String,
    hour: Number,
    clientIp: String
});

module.exports = RequestLog;
