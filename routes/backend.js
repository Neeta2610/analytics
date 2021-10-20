const RequestLog = require('../models/request_log');
const express = require('express');
const moment = require('moment');
const getDb = require('../utils/database').getDb;
const router = express.Router();
const checkClient = require('../utils/checkClient');

require('dotenv').config();
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
});
console.log(pusher);

router.use(checkClient);

router.use((req, res, next) => {
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.socket.remoteAddress
    console.log(ip, "headers ip", req.clientIp, "client IP value is here");
    console.log("req path value is here", req.path, req.query);
    const db = getDb();
    let requestTime = Date.now();
    res.on('finish', async () => {
        if (req.path === '/analytics') {
            return;
        }
        let obj = {
            url: req.path,
            method: req.method,
            responseTime: (Date.now() - requestTime) / 1000, // convert to seconds
            day: moment(requestTime).format("dddd"),
            hour: moment(requestTime).hour(),
            clientIp: req.clientIp
        }
        await db.collection("requestlogs").insertOne(obj);
        require('../analytics_service').getAnalytics()
            .then(analytics =>
                pusher.trigger('analytics', 'updated', { analytics }),
            );
    });
    return next();
});

router.get('/wait/:seconds', async (req, res, next) => {
    await ((seconds) => {
        return new Promise(resolve => {
            setTimeout(
                () => resolve(res.send(`Waited for ${seconds} seconds`)),
                seconds * 1000
            )
        });
    })(req.params.seconds);
});

router.get('/analytics', (req, res, next) => {
    require('../analytics_service').getAnalytics()
        .then(analytics => 
            
            { console.log("analytics data : ",analytics);
                res.render('analytics', { data:analytics })});
});

module.exports = router;