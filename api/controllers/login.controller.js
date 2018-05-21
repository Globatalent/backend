'use strict';

var util = require('util');
var request = require('request');
var Log = require('log');

var appProperties = require('../helpers/config.helper');
var authenticationService = require('../services/authentication.service');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameController = '[Login controller]';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// Login con usuario y pwd
function login(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;

    log.debug(`-----> ${nameController} ${login.name} (IN) --> username: ${username}, password: <<OFUSCATED>>`);

    authenticationService.authenticateUser(username, password)
      .then(result => {
        log.info(`-----> ${nameController} ${login.name} OUT --> result: ${result}`);
        log.info(`User ${username} authenticated!`);
        var userInfo = {
          username: result.username,
          role: result.role
        }
        log.info(`User Info ${JSON.stringify(userInfo)}`);
        var generatedToken = authenticationService.generateToken(userInfo);
        log.info(`Token generated: ${generatedToken}`);
        var jsonToken = { "authorization": generatedToken };
        res.json(jsonToken);
      })
      .catch(err => {
        log.error(err)
        log.info(`User ${username} fails authentication!`);
        res.status(401).send({ "message": "Fail authentication" }); //UNAUTHORIZED
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Login failed" });
  }
}

module.exports = {
  login
};
