'use strict';

var util = require('util');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var Log = require('log');
var rp = require('request-promise');

var appProperties = require('../helpers/config.helper');
var userRepository = require('../repositories/user.repository');
var paymentExpectations = require('../expectations/payment.expectations');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[Investments Service]';
const ERROR_GETUSER = 'ERROR_GETUSER';
var collection = "investor"
var paymentEndpoint = "https://api.sandbox.mangopay.com/v2.01/blockchainust/payins/card/web"
var paymentToken = "Basic YmxvY2tjaGFpbnVzdDpFMDJ0WHh6eDhCcEY3VDRDMThVV3pjTVFYSDYwU25yZGFTZUtPZDZ5a1JtVmV2cmphYQ=="

function getInvestorField(username, filter) {

  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${getInvestorField.name} (IN) -> criteria: ${JSON.stringify(username)}`);
      
      var criteria = {
        username: username
      };

      userRepository.getUserByCriteria(criteria, collection)
      .then (result => {
        log.info(`-----> ${nameModule} ${getInvestorField.name} OUT --> result: ${JSON.stringify(result)}`);  
        resolve({[filter] : result[filter]})
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getInvestorField.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })

    } catch (err) {
      log.error(`-----> ${nameModule} ${getInvestorField.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETUSER)
    }
  }) 
}

function putFounds(username, amount) {

  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${putFounds.name} (IN) -> username: ${JSON.stringify(username)}`);
      
      var completedPayment = paymentExpectations.payment
      completedPayment.DebitedFunds.Amount = amount
      console.log (JSON.stringify(completedPayment))

      var options = {
        method: 'POST',
        uri: paymentEndpoint,
        headers: {
          Authorization: paymentToken
        },
        body: completedPayment,
        json: true // Automatically stringifies the body to JSON
      };

      rp(options)
      .then(function (parsedBody) {
        log.info(`-----> ${nameModule} ${putFounds.name} OUT --> result: ${JSON.stringify(parsedBody)}`);
        resolve({redirectURL : parsedBody.RedirectURL}) 
      })
      .catch(function (err) {
        reject(err)
      });
    } catch (err) {
      log.error(`-----> ${nameModule} ${getInvestorField.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETUSER)
    }
  }) 
}

function postSportsman(parameters) {
  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${postSportsman.name} (IN) -> parameters: ${JSON.stringify(parameters)}`);

      userRepository.getUserByCriteria({username : parameters.username}, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(userResult)}`);
          userResult.watchlist.push({sportsman : parameters.sportsmanID, tokenValue : parameters.tokenValue})
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve (result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${postSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${postSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETSPORTSMAN)
    }
  })
}

function deleteSportsman(parameters) {
  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${postSportsman.name} (IN) -> parameters: ${JSON.stringify(parameters)}`);

      userRepository.getUserByCriteria({username : parameters.username}, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(userResult)}`);

          var index = userResult.watchlist.findIndex(elem => elem.sportsman == parameters.sportsmanID)
          console.log (index + " ***********************numero deportista")
          if (index != -1) {
            userResult.watchlist.splice(index, 1) 
          }
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve (result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${postSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${postSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETSPORTSMAN)
    }
  })
}

module.exports = {
  getInvestorField,
  putFounds,
  postSportsman,
  deleteSportsman
}