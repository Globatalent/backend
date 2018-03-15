'use strict';

var Log = require('log');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

var appProperties = require('./config.helper');

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

var nameModule = '[MongoDB Helper]';

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);

var NUMBEROFCONNECTIONS = 5

var connection = new Array(NUMBEROFCONNECTIONS).fill(null);

////////////////////////////////////////////////////////////////////////////////
// METODOS PRIVADOS
////////////////////////////////////////////////////////////////////////////////

function getMongoDBConfiguration() {

  log.debug(`${nameModule} getConnectionChain (IN) -> no params`);

  var dbConfiguration = {
    url: appProperties.getConfig().mongodatabase.mongoURL + appProperties.getConfig().mongodatabase.database,
    reconectInterval: appProperties.getConfig().mongodatabase.intervalDelay
  }

  log.debug(`${nameModule} getConnectionChain (OUT) -> dbConfiguration: ${JSON.stringify(dbConfiguration)}`);

  return dbConfiguration;
}

function connect(){
  var nameMethod = '[connect]';
  return new Promise((resolve, reject) => {
    var worker = Math.floor((Math.random() * NUMBEROFCONNECTIONS) + 1);
    if (connection[worker] != null) {
      log.debug(`${nameModule} ${nameMethod} -----> Using existing connection, worker: ${worker}`);
      return resolve(connection[worker])
    }
    var mongoconfig = getMongoDBConfiguration();
    log.debug(`${nameModule} ${nameMethod} -----> Connecting to mongoDB, creating worker: -> ${worker}`);
    var intervalObject = setInterval(function(){
      MongoClient.connect(mongoconfig.url, function(err, db) {
        if(err) {
          log.debug(`${nameModule} ${nameMethod} -----> Trying to connect to MongoDB -> ${mongoconfig.url}`);
        }
        else {
          log.debug(`${nameModule} ${nameMethod} -----> Connected to MongoDB`);
          clearInterval(intervalObject);
          connection[worker] = db
          resolve(db);
        }
      });
    }, mongoconfig.reconectInterval);
  });
}

////////////////////////////////////////////////////////////////////////////////
// METODOS PUBLICOS
////////////////////////////////////////////////////////////////////////////////

function getItem(criteria, myCollection){
  var nameMethod = '[getItem]';
  log.info(`${nameModule} ${nameMethod} -----> Getting document by ${criteria}, collection ${myCollection}`);
  return new Promise((resolve, reject) => {
    connect()
    .then(db =>{
      var collection = db.collection(myCollection);
      // Find some documents
      collection.find(criteria).toArray(function(err, docs) {
        if(docs.length === 0){
          log.debug(`${nameModule} ${nameMethod} -----> Not document found by ${criteria} in ${myCollection}`);
         // db.close();
          reject('Not item found in DB');
        }
        else{
          log.info(`${nameModule} ${nameMethod} -----> Document found in mongoDB`);
          log.debug(`${nameModule} ${nameMethod} -----> Item -> ${JSON.stringify(docs[0])}`);
         // db.close();
          resolve(docs[0]);
        }
      });
    })
  });
}

function insertItem (item, myCollection){
  var nameMethod = '[insertItem]';
  log.info(`${nameModule} ${nameMethod} -----> Inserting ${JSON.stringify(item)}`);
  return new Promise((resolve, reject) => {
    connect()
    .then(db =>{
      var collection = db.collection(myCollection);
      collection.insert(item, function(err, result) {
        if(err){
          log.error(`${nameModule} ${nameMethod} -----> Error Inserting ${JSON.stringify(item)} in ${myCollection} -> ${err}`);
         // db.close();
          reject(item);
        }
        else{
          log.info(`${nameModule} ${nameMethod} -----> Item inserted succesfully`);
         // db.close();
          resolve(item);
        }
      });
    })
  });
}

function updateItem(criteria, item, myCollection){
  var nameMethod = '[updateItem]';
  log.info(`${nameModule} ${nameMethod} -----> Updating item`);
  return new Promise((resolve, reject) => {
    connect()
    .then(db =>{
      var collection = db.collection(myCollection);
      collection.findOneAndUpdate(criteria, item, function(err, result) {
        if(err){
          log.error(`${nameModule} ${nameMethod} -----> Error updating item -> ${err}`);
         // db.close();
          reject(err);
        }
        else{
          log.info(`${nameModule} ${nameMethod} -----> item updated succesfully`);
         // db.close();
          resolve(result);
        }
      });
    })
  });
}

function deleteItem(item, myCollection){
  var nameMethod = '[deleteItem]';
  log.info(`${nameModule} ${nameMethod} -----> Deleting item in database`);
  return new Promise((resolve, reject) => {
    connect()
    .then(db =>{
      var collection = db.collection(myCollection);
      collection.deleteOne(item, function(err, result)  {
        if(err){
          log.error(`${nameModule} ${nameMethod} -----> Error deleting item -> ${err}`);
         // db.close();
          reject(err);
        }else{
          log.info(`${nameModule} ${nameMethod} -----> Item removed succesfully`);
         // db.close();
          resolve(result);
        }
      })
    })
  })
}

module.exports = {
  getMongoDBConfiguration, // for testing
  getItem,
  insertItem,
  updateItem,
  deleteItem
}
