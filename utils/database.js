const mongodb = require('mongodb');
const config = require('../config.json');
const MongoClient = mongodb.MongoClient;
const dbOptions = config.mongodb.options;

module.exports.dbNameUrl = function () {
    var dbName = (config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);

    if (config.mongodb.username && config.mongodb.password) {
        dbName = config.mongodb.username + ":" + config.mongodb.password + "@" + dbName;
    }

    if (dbName.indexOf('mongodb://') !== 0) {
        dbName = 'mongodb://' + dbName;
    }
    return dbName;
}
let _db;

const mongoConnect = callback => {

    // var dbName = this.dbNameUrl()
    var dbName = "mongodb+srv://Airport:0D80aY6DwSmdJCaN@cluster0.8hhfw.mongodb.net/analytics?retryWrites=true&w=majority"

    console.log("mongo connect ", dbName, dbOptions);
    MongoClient.connect(
        dbName, dbOptions
    )
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback(_db);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {

        return _db;
    }
    throw 'No database found!';
};

const closeDb = () => {
    _db.close();
    return;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.closeDb = closeDb;
