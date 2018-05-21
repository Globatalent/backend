'use strict';

var Log = require('log');
const _ = require('lodash');

var appProperties = require('../helpers/config.helper');
var pictureHelper = require('../helpers/picture.helper');
var userRepository = require('../repositories/user.repository');
var sportsmanRepository = require('../repositories/sportsman.repository');
var investmentsService = require('../services/investments.service');
var mongoDbHelper = require('../helpers/mongodb.helper');


////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[Sportsman Service]';
var ERROR_GETSPORTSMAN = "ERROR_GETSPORTSMAN"

var collection = "sportsman"

function getSportsmen() {
  return new Promise((resolve, reject) => {

    var criteria = {
    };
    log.info(`-----> ${nameModule} ${getSportsmen.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUsersByCriteria(criteria, "sportsman")
      .then(result => {
        var resume = result.map(player => player = {
          sportsmanID: player.sportsmanID,
          completeName: player.overview.completeName,
          sport: player.overview.sport,
          country: player.overview.country
        })
        console.log("****************************")
        console.log(JSON.stringify(resume))
        return resume
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsmen.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
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

    var criteria = {
      sportsmanID: params.id
    };
    log.info(`-----> ${nameModule} ${getSportsman.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUserByCriteria(criteria, "sportsman")
      .then(result => {
        return result.overview
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
  });
}

function getSportsmanDetail(params) {
  return new Promise((resolve, reject) => {

    var criteria = {
      sportsmanID: params.id
    };
    log.info(`-----> ${nameModule} ${getSportsmanDetail.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUserByCriteria(criteria, "sportsman")
      .then(result => {
        return Object.assign({},result.personalInfo, result.social, result.info)
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsmanDetail.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
  });
}

function getSportsmanMilestones(params) {
  return new Promise((resolve, reject) => {

    var criteria = {
      sportsmanID: params.id
    };
    log.info(`-----> ${nameModule} ${getSportsmanMilestones.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUserByCriteria(criteria, "sportsman")
      .then(result => {
        return result.milestones
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsmanMilestones.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
  });
}

function getSportsmanStock(sportsmanID) {
  
  return new Promise((resolve, reject) => {
    try {
      log.info(`-----> ${nameModule} ${getSportsmanStock.name} (IN***********************) -> username: ${JSON.stringify(sportsmanID)}`);
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

    var criteria = {
      sportsmanID: params.id
    };
    log.info(`-----> ${nameModule} ${getSportsmanExpenses.name} (IN) -> criteria: ${JSON.stringify(criteria)}`);
    userRepository.getUserByCriteria(criteria, "sportsman")
      .then(result => {
        return result.expenses
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${getSportsmanExpenses.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err);
      });
  });
}

function putTokens(username, sportsmanID, amount) {

  return new Promise((resolve, reject) => {

    try {
      log.info(`-----> ${nameModule} ${putTokens.name} (IN) -> username: ${username}, sportsmanID: ${sportsmanID}, amount: ${amount}`);

      var resultGetSportsmanStock;
      var resultInvestments;
      var checkParamsResult;
      getSportsmanStock(sportsmanID)
        .then(result => {
          resultGetSportsmanStock = result;          
          return investmentsService.getInvestorField(username, "overview");
        })
        .then(result => {
          resultInvestments = result;
          log.info(`-----> ${nameModule} ${putTokens.name} OUT --> result: ${JSON.stringify(result)}`);
          return checkparams(resultGetSportsmanStock, resultInvestments.overview, amount)
        })
        .then(result => {
          if (result.result == "success") {
            checkParamsResult = result
            return moveTokens(username, sportsmanID, amount, resultGetSportsmanStock.tokens, resultGetSportsmanStock.overview.completeName)
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
    getSportsmanPicture(params)
    .then(picture => {
      sportsmanRepository.editPicture(
        {
          sportsmanId: params.id
        },
        {
          sportsmanId: params.id,
          picture: params.file,
        },
          'sportsman_images'
        ).then(res =>{
          return resolve(true);
        }).catch(err =>{
          log.debug(`-----> ${nameModule} ${setSportsmanPicture.name} Error setting image`)
          return reject(err)
        })
    })
    .catch(err =>{
      // No tengo foto (insert)
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
      });
    }) 
    // log.debug(`-----> ${nameModule} ${setSportsmanPicture.name} Sportsman with id ${params.id} not found`)

  });
}

function checkparams(resultGetSportsmanStock, overview, amount) {
  var fcashFounds = parseFloat(overview.cashFounds)
  var famount = parseFloat(amount)
  var ftokenValue = parseFloat(resultGetSportsmanStock.tokens.tokenValue)
  var ftokenSupply = parseFloat(resultGetSportsmanStock.tokens.currentSupply)

  if (overview.validate1 == false) {
    return { result: "failed", message: "You have to validate your account first" }
  } else if (famount <= 0){
    return { result: "failed", message: "Number of tokens must be a positive value" }
  } else if (fcashFounds < (famount * ftokenValue)) {
    return { result: "failed", message: "Not enough funds" }
  } else if (ftokenSupply < famount) {
    return { result: "failed", message: "Not enough tokens available to buy" }
  } else {
    return { result: "success", message: "Tokens have been added" }
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
    log.info('------------------------ full name valor : ');
    log.info('------------------------ full name valor : '+fullName);
    log.info('------------------------ full name valor : ');
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
    userRepository.getUserByCriteria({ sportsmanID: sportsmanData.sportsmanID }, "sportsman")
      .then(result => {
        Object.assign(sportsmanData, result.tokens)
        sportsmanData.changes = parseFloat(Math.round((Math.random() * 400)-200) / 100);
        resolve(sportsmanData)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${addTokenInfo.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
        reject(err)
      })
  })
}

function putSportsman(parameters) {
  return new Promise((resolve, reject) => {
    log.info(`-----> ${nameModule} ${putSportsman.name} (IN) -> username: ${parameters.sportsmanID}`);
    userRepository.getUserByCriteria({ sportsmanID: parameters.sportsmanID }, "sportsman")
      .then(sportsmanResult => {
        Object.assign(sportsmanResult,parameters.sportsmanNewInfo)
        return userRepository.updateUser(sportsmanResult, "sportsman")
      })
      .then(() => {
        return userRepository.getUserByCriteria({ sportsmanID: parameters.sportsmanID }, "sportsman")
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        log.error(`-----> ${nameModule} ${putSportsman.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
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
  getSportsmenMarket,
  putSportsman
}