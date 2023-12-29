const mongodb = require('mongodb');
const MongoClients = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClients.connect('mongodb://localhost:27017/?directConnection=true')
    .then((client)=>{
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        console.log("eee");
    });
};

const getDB = () => {
    if(_db){
        return _db;
    }
    else {
        return 'No Data in our DataBase';
    }
}

exports.mongoConnect = mongoConnect ;
exports.getDB = getDB ;
