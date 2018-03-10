'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var mongoDbHelper = require('../helpers/mongodb.helper');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var nameModule = '[User Repository]';
var log = new Log('debug');

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const ERROR_INSERTUSER = 'ERROR_INSERTUSER';
const ERROR_ITEM_EXIST = 'ERROR_ITEM_EXIST';
const ERROR_GETUSER = 'ERROR_GETUSER';


////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getUserByCriteria(criteria, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${getUserByCriteria.name} (IN) -> criteria: ${JSON.stringify(criteria)}, collection: ${collection}`);
      
      mongoDbHelper.getItem(criteria, collection)
      .then(result => {   
        delete result._id;
        resolve(result);
      })
      .catch(error => {
        log.error(`-----> ${nameModule} ${getUserByCriteria.name} (ERROR) -> ${error.message}`);
        reject(ERROR_GETUSER);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${getUserByCriteria.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETUSER);
    }    
  })
}

function insertUser(user, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${insertUser.name} (IN) -> user: ${JSON.stringify(user)}, collection: ${collection}`);
      
      mongoDbHelper.insertItem(user, collection)
      .then(result => {   
        delete result._id;
        resolve(result);
      })
      .catch(error => {
        log.error(`-----> ${nameModule} ${insertUser.name} (ERROR) -> ${error.message}`);
        reject(ERROR_INSERTUSER);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${insertUser.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_INSERTUSER);
    }    
  })
}

function updateUser(user, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${updateUser.name} (IN) -> user: ${JSON.stringify(user)}, collection: ${collection}`);
      
      mongoDbHelper.updateItem({username : user.username}, user, collection)
      .then(result => {   
        delete result._id;
        resolve(result);
      })
      .catch(error => {
        log.error(`-----> ${nameModule} ${updateUser.name} (ERROR) -> ${error.message}`);
        reject(ERROR_INSERTUSER);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${updateUser.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_INSERTUSER);
    }    
  })
}

function itemExist(criteria, collection) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${nameModule} ${itemExist.name} (IN) -> Criteria: ${JSON.stringify(criteria)}, collection: ${collection}`);
      
      mongoDbHelper.getItem(criteria, collection)
      .then(result => {   
        resolve(true);
        log.error(`-----> ${nameModule} ${itemExist.name} (ERROR) -> ${error.message}`);
      })
      .catch(error => {
        resolve(false);
      })

   } catch(err) {
      log.error(`-----> ${nameModule} ${itemExist.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_ITEM_EXIST);
    }    
  })
}

////////////////////////////////////////////////////////////////////////////////
// MODULE EXPORTS
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getUserByCriteria,
  insertUser,
  itemExist,
  updateUser,
  ERROR_GETUSER,
  ERROR_INSERTUSER,
  ERROR_ITEM_EXIST
};

