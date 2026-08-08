const { MongoClient } = require("mongodb");

let db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ac-1tdfvn2-shard-00-00.orohmu2.mongodb.net:27017,ac-1tdfvn2-shard-00-01.orohmu2.mongodb.net:27017,ac-1tdfvn2-shard-00-02.orohmu2.mongodb.net:27017/?ssl=true&replicaSet=atlas-12q7vc-shard-0&authSource=admin&appName=Cluster0`,
  )
    .then((client) => {
      console.log("connected");
      db = client.db("shop");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw new Error("No Database Found");
};
module.exports = { mongoConnect, getDb };
