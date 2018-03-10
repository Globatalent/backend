'use strict';

var Log = require('log');

var appProperties = require('../helpers/config.helper');
var controllerHelper = require('../helpers/controller.helper');
var investmentsService = require('../services/investments.service');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameController = '[Investments controller]';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getInvestments(req, res) {
  try{
    var parameters = {
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${getInvestments.name} IN --> ${parameters.username}`);
    investmentsService.getInvestorField(parameters.username, "investments")
    .then(result => {
      log.info(`-----> ${nameController} ${getInvestments.name} OUT --> result: ${JSON.stringify(result)}`);
      res.json(result)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail get investments"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail get investments"});
  }
}

function getWatchlist(req, res) {
  try {

    var parameters = {
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${getWatchlist.name} IN --> ${parameters.username}`);
    investmentsService.getInvestorField(parameters.username, "watchlist")
    .then(result => {
      log.info(`-----> ${nameController} ${getWatchlist.name} OUT --> result: ${JSON.stringify(result)}`);
      res.json(result)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail get watchlist"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail get watchlist"});
  }
}

function getInvestmentsOverview(req, res) {
  try{

    var overviewResult

    var parameters = {
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${getInvestmentsOverview.name} IN --> ${parameters.username}`);
    investmentsService.getInvestorField(parameters.username, "overview")
    .then(result => {
      log.info(`-----> ${nameController} ${getInvestmentsOverview.name} OUT --> result: ${JSON.stringify(result)}`);
      overviewResult = result
      return investmentsService.getInvestorField(parameters.username, "investments")
    })
    .then(result => {
      overviewResult.overview.chart = cookChart(result)

      res.json(overviewResult)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail get overview"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail get overview"});
  }
}

function putFounds(req, res) {
  try{
    var parameters = {
      username: req.body.username,
      amount: req.body.amount
    }
    log.info(`-----> ${nameController} ${putFounds.name} IN --> ${parameters.username}`);
    investmentsService.putFounds(parameters.username, parameters.amount)
    .then(result => {
      log.info(`-----> ${nameController} ${putFounds.name} OUT --> result: ${JSON.stringify(result)}`);
      res.json(result)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail put founds"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail put founds"});
  }
}

function postSportsman(req, res) {
  try{
    var parameters = {
      sportsmanID: req.body.sportsmanID,
      tokenValue: req.body.tokenValue,
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${postSportsman.name} IN --> ${JSON.stringify(parameters)}`);
    investmentsService.postSportsman(parameters)
    .then(result => {
      log.info(`-----> ${nameController} ${postSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
      res.json(result)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail follow sportsman"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail follow sportsman"});
  }
}

function deleteSportsman(req, res) {
  try{
    var parameters = {
      sportsmanID: req.body.sportsmanID,
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${deleteSportsman.name} IN --> ${JSON.stringify(parameters)}`);
    investmentsService.deleteSportsman(parameters)
    .then(result => {
      log.info(`-----> ${nameController} ${deleteSportsman.name} OUT --> result: ${JSON.stringify(result)}`);
      res.json(result)
    })
    .catch(err => {
    log.error(err)
    res.status(500).send({"message": "Fail unfollow sportsman"});
    })
  } catch(err) {
    log.error(err)
    res.status(500).send({"message": "Fail unfollow sportsman"});
  }
}

function cookChart(investments) {
  console.log (JSON.stringify(investments) + "**********************")
  var data = []
  var labels = []
  investments.investments.forEach(elem => labels.push(elem.sportsman))
  investments.investments.forEach(elem => data.push(parseFloat(elem.tokenAmount) * parseFloat(elem.tokenValue)))
  log.info(`-----> ${nameController} ${cookChart.name} OUT --> datachart: ${JSON.stringify({datasets : data, labels})}`);
  return {datasets : data, labels}
}

module.exports = {
  getInvestments,
  getWatchlist,
  getInvestmentsOverview,
  putFounds,
  postSportsman,
  deleteSportsman
}