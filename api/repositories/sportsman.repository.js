'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var mongoDbHelper = require('../helpers/mongodb.helper');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var nameModule = '[Sportsman Repository]';
var log = new Log('debug');

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function setPicture(item, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${setPicture.name} (IN) -> item: ${JSON.stringify(item)}, collection: ${collection}`);
      
      mongoDbHelper.insertItem(item, collection)
      .then(result => {   
        delete result._id;
        resolve(result);
      })
      .catch(error => {
        log.error(`-----> ${nameModule} ${setPicture.name} (ERROR) -> ${error.message}`);
        reject(error);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${setPicture.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }    
  })
}

function getPicture(criteria, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${getPicture.name} (IN) -> criteria: ${JSON.stringify(criteria)}, collection: ${collection}`);
      
      mongoDbHelper.getItem(criteria, collection)
      .then(result => {   
        delete result._id;
        resolve(result);
      })
      .catch(error => {
        log.error(`-----> ${nameModule} ${getPicture.name} (ERROR) -> ${error.message}`);
        reject(error);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${getPicture.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }    
  })
}

////////////////////////////////////////////////////////////////////////////////
// MODULE EXPORTS
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  setPicture,
  getPicture
};

