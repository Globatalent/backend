'use strict';

var util = require('util');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var nodemailer = require('nodemailer');
var Log = require('log');

var appProperties = require('../helpers/config.helper');
var userRepository = require('../repositories/user.repository');
var mailer = require('../helpers/mailer');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = '[User Service]';

////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function createUser(user) {
  return new Promise((resolve, reject) => {
    try {
      log.debug(`${nameModule} ${createUser.name}: data user: ${user}`)

      var collection = user.role;
      
      //Investment Data
      user.investments = [];
      user.watchlist  = [];
      user.overview   = {};
      user.overview.totalFounds = 0;
      user.overview.cashFounds  = 0;
      user.overview.tokenFounds = 0;
      //Create two factor authentication (False because is pending)
      user.overview.validate1 = false;
      user.overview.validate2 = false;

      userRepository.insertUser(user, collection)
      .then(result => { 
        log.info(`-----> ${nameModule} ${createUser.name} OUT --> result: ${JSON.stringify(result)}`); 
        sendMail(user.firstName, user.email);
        resolve(result); 
      })
      .catch(err => {
        reject(err);
      })
    }catch(err) {
      log.error(`-----> ${nameModule} ${createUser.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }
  });
}

function checkUserExist(params) {
  return new Promise((resolve, reject) => {
    try {
      log.debug(`${nameModule} ${checkUserExist.name}: data user: ${JSON.stringify(params)}`)

      var collection = params.role;
      var username   = {
        username: params.username
      }
      userRepository.itemExist(username, collection)
      .then(result => { 
        log.info(`-----> ${nameModule} ${checkUserExist.name} OUT --> result: ${JSON.stringify(result)}`);  
        if(result){
          reject ('User already exist!')
        } else {
          resolve (false);
        }
      })
      .catch(err => {
        reject(err);
      })
    }catch(err) {
      log.error(`-----> ${nameModule} ${checkUserExist.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }
  });
}

function sendMail(name, email) {
  var mailOptions = {
      from: appProperties.getConfig().email,
      to: email,
      subject: 'GlobaTalent - Please Confirm Your E-mail Address ',
      html:
      // html:
      `Dear  ` + name + `,
        <br><br>Wellcome to GlobaTalent , thanks for registering in.
      <br><br>You're receiving this e-mail because user:  </b>`+ email + ` has given yours as an e-mail address to connect their account.<br><br>
      Kindly use the following link to confirm this is correct, go to: <a href="http://localhost:8080/home">Confirm User</a>
      <br><br>
      <h2><b style="color:#335aa1">Globa</b><b style="color:#4e87b1">talent</b></h2>
      <h6> <pre style="color:#000"> D E C E N T R A L I Z E D   S P O R T S </pre></h6>`
  };
  mailer.sendMail(mailOptions, function (error, info) {
      if (error) {
          log.error(error);
      } else {
          lig.debug('Message sent: ' + info.response);
      }
  });
}


module.exports = {
  createUser,
  checkUserExist
};