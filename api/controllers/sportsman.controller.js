'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var controllerHelper = require('../helpers/controller.helper');
let sportsmanService = require('../services/sportsman.service');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameController = '[Sportsman controller]';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getSportsmen(req, res) {

  try {

    log.info(`-----> ${nameController} ${getSportsmen.name} IN --> `);

    sportsmanService
      .getSportsmen()
      .then(sportmanList => {
        log.info(`-----> ${nameController} ${getSportsmen.name} OUT --> result: ${JSON.stringify(sportmanList)}`);
        res.json(sportmanList);
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmen.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmen.name, err, res);
  }

}

function getSportsmenMarket(req, res) {

  try {

    log.info(`-----> ${nameController} ${getSportsmen.name} IN --> `);

    sportsmanService
      .getSportsmenMarket()
      .then(sportmanList => {
        log.info(`-----> ${nameController} ${getSportsmenMarket.name} OUT --> result: ${JSON.stringify(sportmanList)}`);
        res.json(sportmanList);
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmenMarket.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmenMarket.name, err, res);
  }

}

function getSportsman(req, res) {

  try {

    const params = {
      id: req.swagger.params.sportsmanID.value
    };

    log.info(`-----> ${nameController} ${getSportsman.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsman(params)
      .then(sportmanDetail => {
        log.info(`-----> ${nameController} ${getSportsman.name} OUT --> result: ${JSON.stringify(sportmanDetail)}`);
        if (sportmanDetail)
          res.json(sportmanDetail);
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsman.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsman.name, err, res);
  }

}

function getSportsmanDetail(req, res) {

  try {

    const params = {
      id: req.swagger.params.sportsmanID.value
    };

    log.info(`-----> ${nameController} ${getSportsmanDetail.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsmanDetail(params)
      .then(sportmanDetail => {
        log.info(`-----> ${nameController} ${getSportsmanDetail.name} OUT --> result: ${JSON.stringify(sportmanDetail)}`);
        if (sportmanDetail)
          res.json(sportmanDetail);
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmanDetail.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmanDetail.name, err, res);
  }

}

function getSportsmanMilestones(req, res) {

  try {

    const params = {
      id: req.swagger.params.sportsmanID.value
    };

    log.info(`-----> ${nameController} ${getSportsmanMilestones.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsmanMilestones(params)
      .then(sportsmanMilestones => {
        log.info(`-----> ${nameController} ${getSportsmanMilestones.name} OUT --> result: ${JSON.stringify(sportsmanMilestones)}`);
        if (sportsmanMilestones)
          res.json(sportsmanMilestones);
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmanMilestones.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmanMilestones.name, err, res);
  }

}

function getSportsmanStock(req, res) {

  try {

    const params = {
      sportsmanID: req.swagger.params.sportsmanID.value
    };

    log.info(`-----> ${nameController} ${getSportsmanStock.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsmanStock(params.sportsmanID)
      .then(sportsmanStock => {
        log.info(`-----> ${nameController} ${getSportsmanStock.name} OUT --> result: ${JSON.stringify(sportsmanStock)}`);
        if (sportsmanStock)
          res.json(sportsmanStock);
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmanStock.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmanStock.name, err, res);
  }

}

function getSportsmanExpenses(req, res) {

  try {

    const params = {
      id: req.swagger.params.sportsmanID.value
    };

    log.info(`-----> ${nameController} ${getSportsmanExpenses.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsmanExpenses(params)
      .then(sportsmanExpenses => {
        log.info(`-----> ${nameController} ${getSportsmanExpenses.name} OUT --> result: ${JSON.stringify(sportsmanExpenses)}`);
        if (sportsmanExpenses)
          res.json(sportsmanExpenses);
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmanExpenses.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmanExpenses.name, err, res);
  }

}

function putTokens(req, res) {
  try {
    var parameters = {
      username: req.body.username,
      sportsmanID: req.body.sportsmanID,
      amount: req.body.amount
    }
    log.info(`-----> ${nameController} ${putTokens.name} IN --> ${parameters.username}`);
    sportsmanService.putTokens(parameters.username, parameters.sportsmanID, parameters.amount)
      .then(result => {
        log.info(`-----> ${nameController} ${putTokens.name} OUT --> result: ${JSON.stringify(result)}`);
        res.json(result)
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail get tokens" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail get tokens" });
  }
}

function getSportsmanPicture(req, res) {
  try {
    const params = {
      id: req.swagger.params.sportsmanID.value
    };
    log.info(`-----> ${nameController} ${getSportsmanStock.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .getSportsmanPicture(params)
      .then(sportmanPhoto => {
        log.info(`-----> ${nameController} ${getSportsmanPicture.name} OUT --> result: ${JSON.stringify('Photo got correctly')}`);
        if (sportmanPhoto){
          res.contentType(sportmanPhoto.mimetype);
          res.end(sportmanPhoto.buffer.buffer);
        } else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, getSportsmanPicture.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, getSportsmanPicture.name, err, res);
  }
}

function setSportsmanPicture(req, res) {
  try {
    const params = {
      id: req.swagger.params.sportsmanID.value,
      file: req.swagger.params.newPicture.value
    };
    log.info(`-----> ${nameController} ${getSportsmanStock.name} IN --> ${JSON.stringify(params)}`);

    sportsmanService
      .setSportsmanPicture(params)
      .then(result => {
        log.info(`-----> ${nameController} ${setSportsmanPicture.name} OUT --> result: ${JSON.stringify('Photo saved correctly')}`);
        if (result)
          res.json({message: "Photo saved correctly"});
        else
          res.status(404).json({ message: "Sportman not found" });
      })
      .catch(err => {
        controllerHelper.handleGenericErrorResponse(nameController, setSportsmanPicture.name, err, res);
      })

  } catch (err) {
    controllerHelper.handleGenericErrorResponse(nameController, setSportsmanPicture.name, err, res);
  }
}

module.exports = {
  getSportsmen,
  getSportsman,
  getSportsmanDetail,
  getSportsmanMilestones,
  getSportsmanStock,
  getSportsmanExpenses,
  putTokens,
  getSportsmanPicture,
  setSportsmanPicture,
  getSportsmenMarket
}