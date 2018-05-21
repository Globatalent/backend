'use strict';

var util = require('util');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var nodemailer = require('nodemailer');
var Log = require('log');

var appProperties = require('../helpers/config.helper');
var userRepository = require('../repositories/user.repository');
var sportsmanService = require('../services/sportsman.service');
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
  var collection = user.role;
  
  if(collection == 'investor'){
  return new Promise((resolve, reject) => {
    try {
      log.debug(`${nameModule} ${createUser.name}: (IN): ${JSON.stringify(user)}`)
      collection = 'investor';
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
      delete user.sportsmanID;
      delete user.videos;
      delete user.country;
      delete user.residence;

      userRepository.insertUser(user, collection)
      .then(result => { 
        log.info(`-----> ${nameModule} ${createUser.name} OUT --> result: ${JSON.stringify(result)}`); 
        sendMail(user.name + ' ' + user.surname, user.email);
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
  }else if(collection == 'sportsman'){
    
    // EDITAR CAMPOS PARA GUARDAR LO QUE REALMENTE NECESITA EL SPORTSMAN
      return new Promise((resolve, reject) => {
    try {
      log.debug(`${nameModule} ${createUser.name}: (IN): ${JSON.stringify(user)}`)
      //userRepository.getUserByCriteria(criteria, "sportsman")
      user.sportsmanID = user.username;
      collection = 'sportsman';
      user.noOfLikes = 0;
      var secondLetterToken = user.completeName.split(" "); 

      // Tokens Data
      user.tokens = {};
      user.tokens.totalSupply = parseFloat(Math.round((Math.random() * 100000+1)));
      user.tokens.currentSupply = user.tokens.totalSupply;
      user.tokens.tokenValue = parseFloat(Math.round((Math.random() * 1000))/100);
      user.tokens.tokenName = (user.completeName.charAt(0).toUpperCase()) + (secondLetterToken[1].charAt(0).toUpperCase()) + 'T';

      //Investment Data
      user.overview   = {};
      user.overview.completeName = user.completeName;
      user.overview.country = user.country;
      user.overview.sport = '';
      user.overview.about = '';
      user.overview.noOfLikes = user.noOfLikes;
      user.overview.sport = user.sport;

      // Personal Info Data
      user.personalInfo = {};
      user.personalInfo.residence = user.residence;
      user.personalInfo.born = user.birthdate;
      user.personalInfo.birthdate = '';
      user.personalInfo.height = '';
      user.personalInfo.weight = '';
      user.personalInfo.coach = '';
      user.personalInfo.proDate = '';
      user.personalInfo.team = '';

      // Social Data

      user.social = {};
      user.social.facebookLink = '';
      user.social.linkedinLink = '';
      user.social.twitterLink = '';
      user.social.youtubeLink = '';
      user.social.vimeoLink = '';
      user.social.instagramLink = '';
      // Info Data

      user.info = {};
      user.info.videos = user.videos;
      user.info.descriptionText = '';

      // Milestones & Expenses
      user.milestones = [];
      user.expenses = [];

      userRepository.insertUser(user, collection)
      .then(result => { 
        log.info(`-----> ${nameModule} ${createUser.name} OUT --> result: ${JSON.stringify(result)}`); 
        sendMail(user.overview.completeName, user.email);
        resolve(result); 
      })
      .then(result => { 
        log.info(`-----> ${nameModule} ${createUser.name} OUT --> result: ${JSON.stringify(result)}`); 
        
        resolve(result); 
      })
      .catch(err => {
        reject(err);
      })
    }catch(err) {
      log.error(`-----> ${nameModule} ${createUser.name} (ERROR) -> error generico: ${JSON.stringify(err.stack)}`);
      reject(err);
    }

      delete user.completeName;
      delete user.role;
      delete user.birthdate;
      delete user.videos;
      delete user.country;
      delete user.residence;
      delete user.sport;
  });
  }
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

function sendMail(completeName, email) {

  log.debug(`${nameModule} ${sendMail.completeName}: (IN) --> completeName: ${completeName}, email: ${email}`)

  var mailOptions = {
      from: appProperties.getConfig().email,
      to: email,
      subject: 'GlobaTalent - Please Confirm Your E-mail Address ',
      html:
      // html:
      `Dear  ` + completeName + `,
        <br><br>Wellcome to GlobaTalent , thanks for registering in.
      <br><br>You're receiving this e-mail because user:  </b>`+ email + ` has given yours as an e-mail address to connect their account.<br><br>
      Kindly use the following link to confirm this is correct, go to: <a href="` + appProperties.getConfig().urlMail + `">Confirm User</a>
      <br><br>
      <img src="https://globatalent.com/wp-content/uploads/2018/02/180x60.png" alt="Logo Globatalent">`
  };
  mailer.sendMail(mailOptions, function (error, info) {
      if (error) {
          log.error(error);
      } else {
          lig.debug('Message sent: ' + info.response);
      }
  });
}

function sendMailPassword(completeName, email, newPassword) {

  log.debug(`${nameModule} ${sendMailPassword.completeName}: (IN) --> completeName: ${completeName}, email: ${email}`)

  var mailOptions = {
      from: appProperties.getConfig().email,
      to: email,
      subject: 'GlobaTalent - Reset password request',
      html:
      // html:

      `Dear  ` + completeName + `,

      <br><br>You're receiving this e-mail because you or someone else has requested a password for your user account.<br>
      <br>Your new password is <b>` + newPassword + `</b> , please change it as soon as possible.<br>
      <br>Thank you for using globatalent!<br><br>

      <img src="https://globatalent.com/wp-content/uploads/2018/02/180x60.png" alt="Logo Globatalent">`
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
  checkUserExist,
  sendMailPassword
};