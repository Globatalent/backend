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
  
  var username = req.body.username;
  var password = req.body.password;
  var role     = req.body.role;

  log.debug(`-----> ${nameController} ${login.name} (IN) --> username: ${username}, password: <<OFUSCATED>>, role ${role}`);

  authenticationService.authenticateUser(username, password, role)
  .then(result => { 
    log.info(`-----> ${nameController} ${login.name} OUT --> result: ${result}`);  
    log.info(`User ${username} authenticated!`);
    var userInfo = {
      username: username,
      role: role
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
    res.status(401).send({"message": "Fail authentication"}); //UNAUTHORIZED
  })
}

module.exports = {
  login
};
