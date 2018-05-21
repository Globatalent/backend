'use strict';

var util = require('util');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var Log = require('log');

var appProperties = require('../helpers/config.helper');
var userRepository = require('../repositories/user.repository');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[Authentication Service]';

////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// Revolves the token.
// Returns true if token is resolved correctly of false in another case
function resolveToken(token) {

  var bResult = false;

  try {
    var payload = jwt.decode(token, appProperties.getConfig().token_secret);

    //Check expiration date
    if (payload.exp > moment().unix()) {
      bResult = true;
    }

  } catch (err) {
    log.error(`${nameModule} Error decoding token ${err}`);
  }
  return bResult;
}

// Refreshes the token by an amount of time equals as token_expiration
function refreshToken(token) {

  try {
    var payload = jwt.decode(token, appProperties.getConfig().token_secret);

    payload.iat = moment().unix();
    payload.exp = moment().add(appProperties.getConfig().token_expiration, "minutes").unix();

    return jwt.encode(payload, appProperties.getConfig().token_secret);

  } catch (err) {
    log.error(`${nameModule} Error refreshing token ${err}`);
    return null;
  }
}

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// Authenticates the user by username and password parameters
// Returns the user if the user is authenticated correctly or null in another case
function authenticateUser(username, password) {

  return new Promise((resolve, reject) => {
    try {
      log.debug(`${nameModule} ${authenticateUser.name}: username: ${username}, pwd <<OFUSCATED>>,`)

      var criteria = {
        password: password
      };
      if (username.indexOf("@") != -1) {
        criteria.email = username
      }
      else {
        criteria.username = username
      }

      userRepository.getUserByCriteria(criteria, "investor")
        .then(result => {
          log.info(`-----> ${nameModule} ${authenticateUser.name} OUT --> result: ${JSON.stringify(result)}`);
          resolve({username: result.username, role: "investor"});
        })
        .catch(err => {
          userRepository.getUserByCriteria(criteria, "sportsman")
          .then( result => {
            console.log(result.username)
            resolve({username: result.username, role: "sportsman"});
          })
          .catch(err => {
            reject("error");
          })
        })
    } catch (err) {
      log.error(`-----> ${nameModule} ${authenticateUser.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }
  });
}

// Generates the token using credentials of username, timestamp of creation and timestamp of expiration.
// Uses H256 to encoding the token payload
function generateToken(userInfo) {

  var payload = {
    sub: userInfo,
    iat: moment().unix(),
    exp: moment().add(appProperties.getConfig().token_expiration, "minutes").unix()
  };
  //By default uses HS256 to encoding
  log.debug(`${nameModule} Generando token con el secret ${appProperties.getConfig().token_secret}`);

  return jwt.encode(payload, appProperties.getConfig().token_secret);
}

// Validates the token
// This funcion is used as middleware function of express.
// If token is resolves, continues the flow of the application.
// In another case, returns a json response with a message and code error type
function validateToken(req, res, next) {

  log.debug(`${nameModule} ${validateToken.name} (IN)`);
  var jsonResult;

  try {

    //Token not received in headers with name authorization
    if (!req.headers.authorization) {

      jsonResult = {
        "code": "401",
        "message": "Authorization token not received"
      };
      res.status(401).send(jsonResult);

    } else {

      var token = req.headers.authorization.split(" ")[1];
      log.debug(`${nameModule} ${validateToken.name} --> token: ${token}`);

      var bResult = resolveToken(token);

      if (bResult) {
        refreshToken(token)
        next();
      } else {
        jsonResult = {
          "code": "401",
          "message": "Token not valid or expired"
        };
        res.status(401).send(jsonResult);
      }
    }
  } catch (err) {
    log.error(err);
    jsonResult = {
      "code": "401",
      "message": "Malformed authorization token"
    };

    res.status(401).send(jsonResult);
  }
}

function checkUser(req, res, next) {
  log.debug(`${nameModule} ${checkUser.name} (IN)`);

  try {

    var token = req.headers.authorization.split(" ")[1];
    log.debug(`${nameModule} ${checkUser.name} --> token: ${token}`);

    var payload = jwt.decode(token, appProperties.getConfig().token_secret);
    if (payload && payload.sub && payload.sub.username === req.params.username) {
      refreshToken(token);
      next();
    } else {
      let jsonResult = {
        "code": "401",
        "message": "Not your profile"
      };
      res.status(401).send(jsonResult);
    }

  } catch (err) {
    log.error(err);
    jsonResult = {
      "code": "401",
      "message": "Malformed authorization token"
    };

    res.status(401).send(jsonResult);
  }

}

module.exports = {
  authenticateUser,
  generateToken,
  validateToken,
  checkUser
};