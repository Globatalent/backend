'use strict';

var Log = require('log');
var _ = require('lodash');

var appProperties = require('./config.helper');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log(appProperties.getConfig().logLevel);
var nameModule = "[Controller Helper]";

////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function buildErrorLog(err) {
  var errorLog;
  if (!_.isUndefined(err.stack)) {
    errorLog = err.stack;
  } else if (!_.isUndefined(err)) {
    errorLog = JSON.stringify(err);
  } else {
    errorLog = 'Error no definido';
  }
  return errorLog;
}

function buildGenericResult(data) {
  var result = {
    code: 200,
    message: {
      data: data
    }
  }
  return result;
}

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function handleGenericErrorResponse(nameController, nameMethod, err, res) {
  log.error(`-----> ${nameController} ${nameMethod} (ERROR) -> Error: ${buildErrorLog(err)} `);

  var message;
  if (_.isUndefined(err.message)) {
    message = `Error Interno de Aplicación en ${nameMethod}`;
  } else {
    message = err.message;
  }

  var jsonResultFailed = {
    error: {
      code: 500,
      message: message
    }
  }

  res.status(500).send(jsonResultFailed);
}

module.exports = {
  handleGenericErrorResponse
};
