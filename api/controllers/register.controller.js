'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var controllerHelper = require('../helpers/controller.helper');
var userService = require('../services/user.service');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameController = '[Register controller]';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function register(req, res) {

  var params = req.body;
  
  log.debug(`-----> ${nameController} ${register.name} (IN) --> params: ${JSON.stringify(params)}`);
  
  userService.checkUserExist(params)
  .then(result => { 
    return userService.createUser(params);
  })
  .then(result => {    
    res.json({"message": `Created ${result.username} succesfully`});
  })
  .catch(err => {
    log.error(err)
    res.status(401).send({"message": "User already exist!"}); //UNAUTHORIZED
  })

}

module.exports = {
  register
}