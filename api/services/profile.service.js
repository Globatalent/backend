'use strict';

var sha256 = require('js-sha256').sha256;
var util = require('util');
var request = require('request');
var Log = require('log');

var appProperties = require('../helpers/config.helper');
var userRepository = require('../repositories/user.repository');
var userService = require('../services/user.service');


////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[Profile Service]';
var collection = "investor"

function getProfile(username) {

  return new Promise((resolve, reject) => {
    try {
      log.info(`-----> ${nameModule} ${getProfile.name} (IN) -> criteria: ${JSON.stringify(username)}`);
      
      var criteria = {
        username: username
      };

      userRepository.getUserByCriteria(criteria, collection)
      .then (result => {
        log.info(`-----> ${nameModule} ${getProfile.name} OUT --> result: ${JSON.stringify(result)}`);  
        resolve({
          name : result.name,
          surname : result.surname,
          email : result.email
        })
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getProfile.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })

    } catch (err) {
      log.error(`-----> ${nameModule} ${getProfile.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err)
    }
  }) 
}

function putProfile(parameters) {

  return new Promise((resolve, reject) => {
    try {
      log.info(`-----> ${nameModule} ${putProfile.name} (IN) -> criteria: ${JSON.stringify(parameters)}`);
      
      var criteria = {
        username: parameters.username
      };
      userRepository.getUserByCriteria(criteria, collection)
      .then (result => {
        log.info(`-----> ${nameModule} ${putProfile.name} OUT --> result: ${JSON.stringify(result)}`);
        result.name = parameters.name
        result.surname = parameters.surname
        result.email = parameters.email
        return userRepository.updateUser(result, collection)
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${putProfile.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })

    } catch (err) {
      log.error(`-----> ${nameModule} ${putProfile.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err)
    }
  }) 
}

function putPassword(parameters) {

  return new Promise((resolve, reject) => {
    try {
      log.info(`-----> ${nameModule} ${putPassword.name} (IN) -> criteria: ${JSON.stringify(parameters)}`);
      
      var criteria = {
        username: parameters.username
      };
      userRepository.getUserByCriteria(criteria, collection)
      .then (result => {
        log.info(`-----> ${nameModule} ${putPassword.name} OUT --> result: ${JSON.stringify(result)}`);
        if (parameters.oldPassword != result.password) {
          return resolve({result: "failed", message: "Old password does not match"})
        }
        result.password = parameters.newPassword
        return userRepository.updateUser(result, collection)
      })
      .then(result => {
        resolve({result: "success", message: "Password successfully updated"})
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${putPassword.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })

    } catch (err) {
      log.error(`-----> ${nameModule} ${putPassword.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err)
    }
  }) 
}

function putForgottenPassword(parameters) {

  return new Promise((resolve, reject) => {
    try {
      log.info(`-----> ${nameModule} ${putForgottenPassword.name} (IN) -> criteria: ${JSON.stringify(parameters)}`);
      var criteria = {
        email: parameters.email
      };
      userRepository.itemExist(criteria, collection)
      .then (result => {
        log.info(`-----> ${nameModule} ${putForgottenPassword.name} OUT --> result: ${JSON.stringify(result)}`);
        if (!result) {
          return resolve({result: "failed", message: "This email address does not exists"})
        }
        return userRepository.getUserByCriteria(criteria, collection)
      })
      .then(result => {
        var plainPassword = Math.random().toString(36).slice(-8)
        userService.sendMailPassword(result.username, result.email, plainPassword)
        result.password = sha256(plainPassword) 
        return userRepository.updateUser(result, collection)
      })
      .then(result => {
        resolve({result: "success", message: "An email has been sent with the new password"})
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${putForgottenPassword.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })

    } catch (err) {
      log.error(`-----> ${nameModule} ${putForgottenPassword.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err)
    }
  }) 
}

module.exports = {
  getProfile,
  putProfile,
  putPassword,
  putForgottenPassword
}