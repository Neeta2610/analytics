const getDb = require('./database').getDb

module.exports = async function (req, res, next) {
    try {
        // let db = getDb();
        // if (!req.query.path) {
        //     return res.status(403).send({ status: "403", message: "Access Denied" });
        // }
        // let merchantIp = await db.collection("merchantIp").findOne({ merchantIp: req.query.path });
        // if (!merchantIp) {
        //     return res.status(403).send({ status: "403", message: "Access Denied" });
        // }
        return next();
    }
    catch (e) {
        console.log("error is here", e);
        return res.status(403).send({ status: "403", message: "Access Denied" });
    }

}