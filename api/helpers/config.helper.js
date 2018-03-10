'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var readYaml = require('read-yaml');
var Log = require('log');

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

// Module name
const MODULE_NAME = 'Config Helper';

// Base config pathfile
const CONFIG_PATH_FILE = '';

// Config Loads Modes
const CONFIG_LOAD_MODE_FILE = 'FILE';
const CONFIG_LOAD_MODE_GIT = 'GIT';

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

var log = new Log('debug');

// Configuration Storage
var myConfig = {};

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// Sets the config
function setConfig(config) {
  myConfig = config;
}

// Gets the config
function getConfig() {
  return myConfig;
}

// Loads the configuration
function loadConfig(params) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${MODULE_NAME} ${loadConfig.name} IN --> params: ${params}`);

      if (CONFIG_LOAD_MODE_FILE === params.configLoadMode) {

        this.loadConfigFromYmlFile(params.configFile)
          .then(result => {
            myConfig = result;
            log.info(`-----> ${MODULE_NAME} ${loadConfig.name} OUT --> Configuration got succesfully, result: ${result}`);
            resolve(result);
          })
          .catch(error => {
            log.error(`-----> ${MODULE_NAME} ${loadConfig.name} ERROR --> Can not get the configuration, error: ${error.message}`);
            reject(error);
          })

      } else if (CONFIG_LOAD_MODE_GIT === params.configLoadMode) {

        this.loadConfigFromHost(params.configHost, params.configFile)
          .then(result => {
            myConfig = result;
            log.info(`-----> ${MODULE_NAME} ${loadConfig.name} OUT --> Configuration got succesfully, result: ${result}`);
            resolve(result);
          })
          .catch(error => {
            log.error(`-----> ${MODULE_NAME} ${loadConfig.name} ERROR --> Can not get the configuration, error: ${error.message}`);
            reject(error);
          })

      } else {
        var errorBadConfigLoadMode = `Bad config load mode: ${params.configLoadMode}`;
        log.error(`-----> ${MODULE_NAME} ${loadConfig.name} ERROR --> Can not get the configuration, error: ${errorBadConfigLoadMode}`);
        reject(new Error(errorBadConfigLoadMode));
      }
    } catch (error) {
      log.error(`-----> ${MODULE_NAME} ${loadConfig.name} ERROR --> Can not get the configuration, error: ${error.message}`);
      reject(error);
    }
  })
}

// Loads the configuration from host and filepath
function loadConfigFromHost(host, filePath) {

  return new Promise((resolve, reject) => {

    try {

      log.info(`-----> ${MODULE_NAME} ${loadConfigFromHost.name} IN --> host: ${host}, filePath: ${filePath}`);

      request.get({
        url: host + '/' + filePath,
        json: true
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          log.info(`-----> ${MODULE_NAME} ${loadConfigFromHost.name} OUT --> Configuration got succesfully, body: ${JSON.stringify(body)}`);
          resolve(body)
        } else if (!error && response.statusCode === 404) {
          var errorMessage = 'config file not found';
          log.error(`-----> ${MODULE_NAME} ${loadConfigFromHost.name} ERROR --> Can not get the configuration from host, config file not found`);
          reject(new Error(errorMessage))
        } else {
          log.error(`-----> ${MODULE_NAME} ${loadConfigFromHost.name} ERROR --> Can not get the configuration from host, error: ${error.message}`);
          reject(error)
        }
      })
    } catch (error) {
      log.error(`${MODULE_NAME} ${loadConfigFromHost.name} ERROR --> Can not get the configuration from host, error: ${error.message}`);
      reject(error);
    }
  })
}

// Loads the configuration from yml file
function loadConfigFromYmlFile(file) {

  return new Promise((resolve, reject) => {

    try {

      console.log("Entrando en el loadConfigFromYmlFile");

      log.info(`-----> ${MODULE_NAME} ${loadConfigFromHost.name} IN --> file: ${file}`);

      var completePathFile = CONFIG_PATH_FILE + path.sep + file;

      readYaml(completePathFile, function (error, data) {

        if (!error) {
          log.info(`-----> ${MODULE_NAME} ${loadConfigFromYmlFile.name} OUT --> Configuration got succesfully, result: ${data}`);
          resolve(data);
        } else {
          log.error(`-----> ${MODULE_NAME} ${loadConfigFromYmlFile.name} ERROR --> Can not get the configuration from file, error: ${error.message}`);
          reject(error)
        }
      });
    } catch (error) {
      log.error(`-----> ${MODULE_NAME} ${loadConfigFromYmlFile.name} ERROR --> Can not get the configuration from file, error: ${error.message}`);
      reject(error);
    }
  })
}

module.exports = {
  setConfig,
  getConfig,
  loadConfig,
  loadConfigFromHost,
  loadConfigFromYmlFile
}
