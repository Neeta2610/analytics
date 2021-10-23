const getDb = require('./database').getDb

module.exports = async function (req, res, next) {
    try {
        let db = getDb();
        await db.collection('requestIp').updateOne({
            _ip: req.clientIp
        },
            {
                $set: {
                    updated_time: Math.floor(((new Date()).getTime()) / 1000)
                }

            }, { upsert: true })
        return next();
    }
    catch (e) {
        console.log("error is here", e);
        return res.status(403).send({ status: "403", message: "Access Denied" });
    }

}