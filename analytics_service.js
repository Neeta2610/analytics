const RequestLog = require('./models/request_log');
const getDb = require("./utils/database").getDb;

module.exports = {
    async getAnalytics() {
        const db = getDb();
        let getTotalRequests = db.collection("requestlogs").find({}).count();

        let getStatsPerRoute = db.collection("requestlogs").aggregate([
            {
                $group: {
                    _id: { url: '$url', method: '$method' },
                    responseTime: { $avg: '$responseTime' },
                    numberOfRequests: { $sum: 1 },
                }
            }
        ]).toArray();

        let getRequestsPerDay = db.collection("requestlogs").aggregate([
            {
                $group: {
                    _id: '$day',
                    numberOfRequests: { $sum: 1 }
                }
            },
            { $sort: { numberOfRequests: 1 } }
        ]).toArray();

        let getRequestsPerHour = db.collection("requestlogs").aggregate([
            {
                $group: {
                    _id: '$hour',
                    numberOfRequests: { $sum: 1 }
                }
            },
            { $sort: { numberOfRequests: 1 } }
        ]).toArray();

        let getAverageResponseTime = db.collection("requestlogs").aggregate([
            {
                $group: {
                    _id: null,
                    averageResponseTime: { $avg: '$responseTime' }
                }
            }
        ]).toArray();

        return Promise.all([
            getAverageResponseTime,
            getStatsPerRoute,
            getRequestsPerDay,
            getRequestsPerHour,
            getTotalRequests
        ]).then(results => {

            return {

                averageResponseTime: results[0][0].averageResponseTime,
                statsPerRoute: results[1],
                requestsPerDay: results[2],
                requestsPerHour: results[3],
                totalRequests: results[4],
            };
        })
    }
};
