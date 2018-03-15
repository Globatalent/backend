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
const CHARTTOTALELEMENTS = 5

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getInvestments(req, res) {
  try {
    var parameters = {
      username: req.swagger.params.username.value
    }
    log.info(`-----> ${nameController} ${getInvestments.name} IN --> ${parameters.username}`);
    investmentsService.getInvestorField(parameters.username, "investments")
      .then(result => {
        log.info(`-----> ${nameController} ${getInvestments.name} OUT --> result: ${JSON.stringify(result)}`);
        result.investments.forEach(elem => elem.changes = parseFloat(Math.floor((Math.random() * 10) + 1)) / 10 + 1)
        res.json(result)
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail get investments" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail get investments" });
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
        result.watchlist.forEach(elem => elem.changes = parseFloat(Math.floor((Math.random() * 10) + 1)) / 10 + 1)
        res.json(result)
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail get watchlist" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail get watchlist" });
  }
}

function getInvesting(req, res) {
  try {

    var sportsmanResponse = {}

    var parameters = {
      username: req.swagger.params.username.value,
      sportsmanID: req.swagger.params.sportsmanID.value
    }
    log.info(`-----> ${nameController} ${getInvesting.name} IN --> ${parameters.username} ${parameters.sportsmanID}`);
    investmentsService.getInvestorField(parameters.username, "investments")
      .then(result => {
        log.info(`-----> ${nameController} ${getInvesting.name} OUT --> result: ${JSON.stringify(result)}`);
        var sportsmanInv = result.investments.find(elem => elem.sportsman == parameters.sportsmanID)
        if (sportsmanInv != undefined) {
          sportsmanResponse.investments = sportsmanInv
          sportsmanResponse.type = "investor"
          sportsmanResponse.changes = [1, 1, 1, 1, 1, 1, 1].map(elem => elem + parseFloat(Math.floor((Math.random() * 10) + 1)) / 10)
          res.json(sportsmanResponse)
        }
        return investmentsService.getInvestorField(parameters.username, "watchlist")
      })
      .then(result => {
        var sportsmanWat = result.watchlist.findIndex(elem => elem.sportsman == parameters.sportsmanID)
        res.json(sportsmanWat != -1 ? { type: "follower" } : { type: "nothing" })
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail get investments" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail get investments" });
  }
}


function getInvestmentsOverview(req, res) {
  try {

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
        overviewResult.overview.totalInvest = !overviewResult.overview.validate1 ? 0 : !overviewResult.overview.validate2 ? 5000 : 10000
        if (overviewResult.overview.chart.hasData == true) {
          overviewResult.overview.tokenCapitalization = overviewResult.overview.chart.datasets.reduce((acc, elem) => elem + acc)
          overviewResult.overview.changes = parseFloat(Math.floor((Math.random() * 10) + 1)) / 10 + 1;
        }
        res.json(overviewResult)
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail get overview" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail get overview" });
  }
}

function putFounds(req, res) {
  try {
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
        res.status(500).send({ "message": "Fail put founds" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail put founds" });
  }
}

function postSportsman(req, res) {
  try {
    var parameters = {
      sportsmanID: req.body.sportsmanID,
      fullName: req.body.fullName,
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
        res.status(500).send({ "message": "Fail follow sportsman" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail follow sportsman" });
  }
}

function deleteSportsman(req, res) {
  try {
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
        res.status(500).send({ "message": "Fail unfollow sportsman" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail unfollow sportsman" });
  }
}

function cookChart(investments) {

  var dataLabel = []
  if (investments.investments.length == 0) {
    return { hasData: false }
  }
  investments.investments.forEach(elem => dataLabel.push({label: elem.sportsman, data: (parseFloat(elem.tokenAmount) * parseFloat(elem.tokenValue))}))

  var elements = 0
  var data = []
  var labels = []
  dataLabel.sort(function(a, b){return b.data - a.data})
  if(dataLabel.length > 5) {
    labels[CHARTTOTALELEMENTS - 1] = "Others"
    data[CHARTTOTALELEMENTS - 1] = 0
  } else if (dataLabel.length == 5) {
    labels[CHARTTOTALELEMENTS - 1] = dataLabel[CHARTTOTALELEMENTS - 1].label
    data[CHARTTOTALELEMENTS - 1] = dataLabel[CHARTTOTALELEMENTS - 1].data
  }
  dataLabel.forEach(function (elem) {
    if (elements < CHARTTOTALELEMENTS - 1) {
      data[elements] = elem.data
      labels[elements] = elem.label
      elements++
    }
    else if(dataLabel.length > 5){
      data[elements] += elem.data
    }
  })

  log.info(`-----> ${nameController} ${cookChart.name} OUT --> datachart: ${JSON.stringify({ datasets: data, labels })}`);
  return { datasets: data, labels, hasData: true }
}

function fn(elem) {
  console.log(" patata")
  if (elements < CHARTTOTALELEMENTS - 1) {
    newArray[elements] = elem
    elements++
  }
  else {
    newArray[elements] += elem
  }
}

function validate(req, res) {
  try {
    var parameters = {
      username: req.swagger.params.username.value,
      step: req.swagger.params.body.value.step
    }
    log.info(`-----> ${nameController} ${validate.name} IN --> ${parameters.username}`);
    investmentsService.validate(parameters.username, parameters.step)
      .then(result => {
        log.info(`-----> ${nameController} ${validate.name} OUT --> result: ${JSON.stringify(result)}`);
        res.json(result)
      })
      .catch(err => {
        log.error(err)
        res.status(500).send({ "message": "Fail validation step" });
      })
  } catch (err) {
    log.error(err)
    res.status(500).send({ "message": "Fail validation step" });
  }
}

module.exports = {
  getInvestments,
  getWatchlist,
  getInvestmentsOverview,
  putFounds,
  postSportsman,
  deleteSportsman,
  validate,
  getInvesting
}