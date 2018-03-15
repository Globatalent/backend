'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var controllerHelper = require('../helpers/controller.helper');
var profileService = require('../services/profile.service');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameController = '[Profile controller]';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getProfile(req, res) {
    try {
        var parameters = {
            username: req.swagger.params.username.value
        }
        log.info(`-----> ${nameController} ${getProfile.name} IN --> ${parameters.username}`);
        profileService.getProfile(parameters.username)
            .then(result => {
                log.info(`-----> ${nameController} ${getProfile.name} OUT --> result: ${JSON.stringify(result)}`);
                res.json(result)
            })
            .catch(err => {
                log.error(err)
                res.status(500).send({ "message": "Fail get profile" });
            })
    } catch (err) {
        log.error(err)
        res.status(500).send({ "message": "Fail get profile" });
    }
}

function putProfile(req, res) {
    try {
        var parameters = {
            username: req.swagger.params.username.value,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email
        }
        log.info(`-----> ${nameController} ${putProfile.name} IN --> ${parameters.username}`);
        profileService.putProfile(parameters)
            .then(result => {
                log.info(`-----> ${nameController} ${putProfile.name} OUT --> result: ${JSON.stringify(result)}`);
                res.json(result)
            })
            .catch(err => {
                log.error(err)
                res.status(500).send({ "message": "Fail put profile" });
            })
    } catch (err) {
        log.error(err)
        res.status(500).send({ "message": "Fail put profile" });
    }
}

function putPassword(req, res) {
    try {
        var parameters = {
            username: req.swagger.params.username.value,
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword
        }
        log.info(`-----> ${nameController} ${putPassword.name} IN --> ${parameters}`);
        profileService.putPassword(parameters)
            .then(result => {
                log.info(`-----> ${nameController} ${putPassword.name} OUT --> result: ${JSON.stringify(result)}`);
                res.json(result)
            })
            .catch(err => {
                log.error(err)
                res.status(500).send({ "message": "Fail update password" });
            })
    } catch (err) {
        log.error(err)
        res.status(500).send({ "message": "Fail update password" });
    }
}


function putForgottenPassword(req, res) {
    try {
        var parameters = {
            email: req.body.email
        }
        log.info(`-----> ${nameController} ${putForgottenPassword.name} IN --> ${parameters}`);
        profileService.putForgottenPassword(parameters)
            .then(result => {
                log.info(`-----> ${nameController} ${putForgottenPassword.name} OUT --> result: ${JSON.stringify(result)}`);
                res.json(result)
            })
            .catch(err => {
                log.error(err)
                res.status(500).send({ "message": "Fail update password" });
            })
    } catch (err) {
        log.error(err)
        res.status(500).send({ "message": "Fail update password" });
    }
}

module.exports = {
    getProfile,
    putProfile,
    putPassword,
    putForgottenPassword
}