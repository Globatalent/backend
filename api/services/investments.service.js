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
        .then(result => {
          log.info(`-----> ${nameModule} ${getInvestorField.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve({ [filter]: result[filter] })
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

  console.log("entrando en putFounds...")

  return new Promise((resolve, reject) => {

    try {

      var criteria = {
        username: username
      };

      userRepository.getUserByCriteria(criteria, "investor")
        .then(result => {
          var funds = result.overview.validate2 ? 10000 : result.overview.validate1 ? 5000 : 0
          if (parseFloat(funds) < parseFloat(result.overview.totalFounds) + parseFloat(amount)) {
            reject("You have exceded the investment cash limit")
          }
        })
        .then(() => {
          log.info(`-----> ${nameModule} ${putFounds.name} (IN) -> username: ${JSON.stringify(username)}`);
          var completedPayment = paymentExpectations.payment
          completedPayment.DebitedFunds.Amount = parseInt((parseFloat(amount) * 100)).toString()
          completedPayment.ReturnURL = `${process.env.BACK_HOST}/payment_callback/${username}/`
          console.log("returnURL " + completedPayment.ReturnURL)
          userRepository.getUserByCriteria({ username: username }, "investor")
          .then(userResult => {
            log.info(`-----> ${nameModule} ${increaseUserFunds.name} OUT --> result: ${JSON.stringify(userResult)}`);
            userResult.overview.totalFounds += (parseFloat(amount))
            userResult.overview.cashFounds += (parseFloat(amount))
            return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${increaseUserFunds.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve(result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${increaseUserFunds.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })

          // var options = {
          //   method: 'POST',
          //   uri: paymentEndpoint,
          //   headers: {
          //     Authorization: paymentToken
          //   },
          //   body: completedPayment,
          //   json: true // Automatically stringifies the body to JSON
          // };

          // rp(options)
            // .then(function (parsedBody) {
            //   log.info(`-----> ${nameModule} ${putFounds.name} OUT --> result: ${JSON.stringify(parsedBody)}`);
            //   resolve({ redirectURL: parsedBody.RedirectURL })
            // })
            // .catch(function (err) {
            //   reject(err)
            // });
        })

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

      userRepository.getUserByCriteria({ username: parameters.username }, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(userResult)}`);
          userResult.watchlist.push({ sportsman: parameters.sportsmanID, tokenValue: parameters.tokenValue, fullName: parameters.fullName })
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
          return modifyLike(parameters.sportsmanID, 1)
        })
        .then(result => {
          resolve(result)
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

      userRepository.getUserByCriteria({ username: parameters.username }, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(userResult)}`);

          var index = userResult.watchlist.findIndex(elem => elem.sportsman == parameters.sportsmanID)
          if (index != -1) {
            userResult.watchlist.splice(index, 1)
          }
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          return modifyLike(parameters.sportsmanID, -1)
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${postSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve(result)
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

function increaseUserFunds(username, amount) {
  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${increaseUserFunds.name} (IN) -> username: ${JSON.stringify(username)}`);

      userRepository.getUserByCriteria({ username: username }, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${increaseUserFunds.name} OUT --> result: ${JSON.stringify(userResult)}`);
          userResult.overview.totalFounds += (parseFloat(amount) / 100)
          userResult.overview.cashFounds += (parseFloat(amount) / 100)
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${increaseUserFunds.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve(result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${increaseUserFunds.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${increaseUserFunds.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
    }
  })
}

function validate(username, step) {
  return new Promise((resolve, reject) => {

    if (step != 1 && step != 2) {
      log.error(`-----> ${nameModule} ${validate.name} (ERROR) -> Error validando -> Step debe ser 1 o 2`);
      return reject(new Error("Wrong parameter step"))
    }

    try {
      log.info(`-----> ${nameModule} ${validate.name} (IN) -> parameters: ${JSON.stringify({ username, step })}`);

      userRepository.getUserByCriteria({ username: username }, "investor")
        .then(userResult => {
          log.info(`-----> ${nameModule} ${validate.name} OUT --> result: ${JSON.stringify(userResult)}`);

          if (step == 1) {
            userResult.overview.validate1 = true;
          } else {
            userResult.overview.validate2 = true;
          }
          return userRepository.updateUser(userResult, "investor");
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${validate.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve(result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${validate.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${validate.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETSPORTSMAN)
    }
  })
}


function modifyLike(sportsmanID, like /*1 or -1*/) {
  return new Promise((resolve, reject) => {
    userRepository.getUserByCriteria({ sportsmanID: sportsmanID }, "sportsman")
      .then(sportsmanResult => {
        sportsmanResult.noOfLikes += like
        return userRepository.updateUser(sportsmanResult, "sportsman")
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${addTokenInfo.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

module.exports = {
  getInvestorField,
  putFounds,
  postSportsman,
  deleteSportsman,
  increaseUserFunds,
  validate,
  ERROR_GETUSER
}