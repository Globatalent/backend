'use strict';

var Log = require('log');
const _ = require('lodash');

var appProperties = require('../helpers/config.helper');
var expectations = require('../expectations/sportsman.expectations');
var pictureHelper = require('../helpers/picture.helper');
var userRepository = require('../repositories/user.repository');
var sportsmanRepository = require('../repositories/sportsman.repository');
var investmentsService = require('../services/investments.service');


////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[Sportsman Service]';
var ERROR_GETSPORTSMAN = "ERROR_GETSPORTSMAN"

var collection = "sportsman"

function getSportsmen() {
  return new Promise((resolve, reject) => {
    return resolve(
      expectations.sportsmen.map(sportsman => _.pick(sportsman, ['_id', 'completeName', 'sport', 'country']))

    );
  });
}


function getSportsmenMarket() {
  return new Promise((resolve, reject) => {
    log.info(`-----> ${nameModule} ${getSportsmenMarket.name}`);

    getSportsmen()
      .then(sportsmanResult => {
        log.info(`-----> ${nameModule} ${getSportsmenMarket.name} OUT --> result: ${JSON.stringify(sportsmanResult)}`);

        return Promise.all(sportsmanResult.map(addTokenInfo));
      }).then(resolve)
  }).catch(err => {
    log.error(`-----> ${nameModule} ${getSportsmenMarket.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
    reject(err);
  })
}

function getSportsman(params) {
  return new Promise((resolve, reject) => {
    var sportsman = expectations.sportsmen.find(sportman => sportman._id == params.id)

    var criteria = {
      sportsmanID: params.id
    };
    log.info(`-----> ${nameModule} ${getSportsman.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUserByCriteria(criteria, "sportsman")
      .then(result => {
        sportsman.noOfLikes = result.noOfLikes
      })
      .then(result => {
        resolve(sportsman)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsmenMarket.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
  });
}

function getSportsmanDetail(params) {
  return new Promise((resolve, reject) => {
    return resolve(
      expectations.sportsmenInfo.find(sportman => sportman._id == params.id)
    );
  });
}

function getSportsmanMilestones(params) {
  return new Promise((resolve, reject) => {
    let sportsman = expectations.sportsmenMilestones.find(sportman => sportman._id == params.id);
    return resolve(
      sportsman ? sportsman.milestones : undefined
    );
  });
}

function getSportsmanStock(sportsmanID) {
  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${getSportsmanStock.name} (IN) -> username: ${JSON.stringify(sportsmanID)}`);

      var criteria = {
        sportsmanID: sportsmanID
      };

      userRepository.getUserByCriteria(criteria, "sportsman")
        .then(result => {
          log.info(`-----> ${nameModule} ${getSportsmanStock.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve(result)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${getSportsmanStock.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })

    } catch (err) {
      log.error(`-----> ${nameModule} ${getSportsmanStock.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETSPORTSMAN)
    }
  })
}

function getSportsmanExpenses(params) {
  return new Promise((resolve, reject) => {
    let sportsman = expectations.sportsmenExpenses.find(sportman => sportman._id == params.id);
    return resolve(
      sportsman ? sportsman.expenses : undefined
    );
  });
}

function putTokens(username, sportsmanID, amount) {

  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${putTokens.name} (IN) -> username: ${JSON.stringify(username)}`);

      var resultGetSportsmanStock;
      var resultInvestments;
      var checkParamsResult;

      let sportsmanExpectation = expectations.sportsmen.find(sportsman => sportsman._id === sportsmanID);

      getSportsmanStock(sportsmanID)
        .then(result => {
          resultGetSportsmanStock = result;          
          return investmentsService.getInvestorField(username, "overview");
        })
        .then(result => {
          resultInvestments = result;
          log.info(`-----> ${nameModule} ${putTokens.name} OUT --> result: ${JSON.stringify(result)}`);
          return checkparams(resultGetSportsmanStock, resultInvestments.overview.cashFounds, amount)
        })
        .then(result => {
          if (result.result == "success") {
            checkParamsResult = result
            return moveTokens(username, sportsmanID, amount, resultGetSportsmanStock.tokens, sportsmanExpectation.completeName)
          }
          else {
            resolve(result)
          }
        })
        .then(result => {
          log.info(`-----> ${nameModule} ${putTokens.name} OUT --> final result: ${JSON.stringify(result)}`);
          resolve(checkParamsResult)
        })
        .catch(err => {
          log.error(`-----> ${nameModule} ${putTokens.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
          reject(err)
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${putTokens.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(ERROR_GETSPORTSMAN)
    }
  })
}

function getSportsmanPicture(params) {
  return new Promise((resolve, reject) => {
    sportsmanRepository.getPicture(
      {
        sportsmanId: params.id,
      },
      'sportsman_images'
    )
      .then(data => {
        log.debug(`-----> ${nameModule} ${getSportsmanPicture.name} Got image`)
        return resolve(data.picture)
      }).catch(err => {
        log.debug(`-----> ${nameModule} ${getSportsmanPicture.name} Error getting image`)
        return reject(err)
      })

  });
}

function setSportsmanPicture(params) {
  return new Promise((resolve, reject) => {
    let sportsman = expectations.sportsmenPicture.find(sportman => sportman._id == params.id);
    sportsmanRepository.setPicture(
      {
        sportsmanId: params.id,
        picture: params.file
      },
      'sportsman_images'
    ).then(res => {
      return resolve(true);
    }).catch(err => {
      log.debug(`-----> ${nameModule} ${setSportsmanPicture.name} Error setting image`)
      return reject(err)
    })
    log.debug(`-----> ${nameModule} ${setSportsmanPicture.name} Sportsman with id ${params.id} not found`)

  });
}

function checkparams(resultGetSportsmanStock, resultInvestments, amount) {
  var fcashFounds = parseFloat(resultInvestments)
  var famount = parseFloat(amount)
  var ftokenValue = parseFloat(resultGetSportsmanStock.tokens.tokenValue)
  var ftokenSupply = parseFloat(resultGetSportsmanStock.tokens.currentSupply)

  if (fcashFounds < (famount * ftokenValue)) {
    return { result: "failed", message: "not enough founds" }
  } else if (ftokenSupply < famount) {
    return { result: "failed", message: "not enough tokens availables to buy" }
  } else {
    return { result: "success", message: "tokens have been added" }
  }
}

function moveTokens(username, sportsmanID, tokenAmount, tokenParams, fullName) {
  return new Promise((resolve, reject) => {
    log.info(`-----> ${nameModule} ${moveTokens.name} (IN) -> username: ${JSON.stringify(username)}`);
    extractFoundsFromUserAndInsertTokens(username, tokenAmount, tokenParams, sportsmanID, fullName)
      .then(result => {
        log.info(`-----> ${nameModule} ${moveTokens.name} (OUT) -> username: ${JSON.stringify(username)}`);
        return extractTokensFromSportsman(tokenAmount, sportsmanID)
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${moveTokens.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

function extractTokensFromSportsman(tokenAmount, sportsmanID) {
  return new Promise((resolve, reject) => {
    log.info(`-----> ${nameModule} ${extractTokensFromSportsman.name} (IN) -> username: ${sportsmanID} amount: ${tokenAmount}`);
    userRepository.getUserByCriteria({ sportsmanID: sportsmanID }, "sportsman")
      .then(sportsmanResult => {

        var currentTokens = parseInt(sportsmanResult.tokens.currentSupply) - parseInt(tokenAmount)
        sportsmanResult.tokens.currentSupply = currentTokens

        return userRepository.updateUser(sportsmanResult, "sportsman")
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${extractTokensFromSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

function extractFoundsFromUserAndInsertTokens(username, tokenAmount, tokenParams, sportsmanID, fullName) {
  return new Promise((resolve, reject) => {
    log.info(`-----> ${nameModule} ${extractFoundsFromUserAndInsertTokens.name} (IN) -> username: ${username} amount: ${tokenAmount}`);
    userRepository.getUserByCriteria({ username: username }, "investor")
      .then(userResult => {
        var temp = parseFloat(userResult.overview.cashFounds) - parseFloat(tokenAmount) * parseFloat(tokenParams.tokenValue)
        userResult.overview.cashFounds = temp
        var temp2 = parseFloat(userResult.overview.tokenFounds) + parseFloat(tokenAmount) * parseFloat(tokenParams.tokenValue)
        userResult.overview.tokenFounds = temp2
        var sportsmanIndex = userResult.investments.findIndex(item => item.sportsman == sportsmanID)
        if (sportsmanIndex == -1) {
          userResult.investments.push({ sportsman: sportsmanID, tokenAmount: 0, tokenValue: tokenParams.tokenValue, fullName })
          sportsmanIndex = userResult.investments.length - 1
        }
        var currentTokens = parseInt(userResult.investments[sportsmanIndex].tokenAmount) + parseInt(tokenAmount)
        userResult.investments[sportsmanIndex].tokenAmount = currentTokens
        return userRepository.updateUser(userResult, "investor")
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${extractFoundsFromUserAndInsertTokens.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

function addTokenInfo(sportsmanData) {
  return new Promise((resolve, reject) => {
    userRepository.getUserByCriteria({ sportsmanID: sportsmanData._id }, "sportsman")
      .then(result => {
        Object.assign(sportsmanData, result.tokens)
        sportsmanData.changes = parseFloat(Math.floor((Math.random() * 10) + 1)) / 10 + 1;
        resolve(sportsmanData)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${addTokenInfo.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

module.exports = {
  getSportsmen,
  getSportsman,
  getSportsmanDetail,
  getSportsmanMilestones,
  getSportsmanStock,
  getSportsmanExpenses,
  getSportsmanPicture,
  setSportsmanPicture,
  putTokens,
  getSportsmenMarket
}