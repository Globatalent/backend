'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var Log = require('log');
var cors = require('cors');

var configHelper = require('./api/helpers/config.helper');
var investmentsService = require('./api/services/investments.service');
var rp = require('request-promise');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

// Host y puerto del que obtener la configuracion de la aplicacion
var configHost = process.env.CONFIG_HOST;
var configPath = process.env.CONFIG_PATH;
var paymentToken = "Basic YmxvY2tjaGFpbnVzdDpFMDJ0WHh6eDhCcEY3VDRDMThVV3pjTVFYSDYwU25yZGFTZUtPZDZ5a1JtVmV2cmphYQ=="

var log = new Log('debug');

////////////////////////////////////////////////////////////////////////////////
// ARRANQUE DE LA APLICACION
////////////////////////////////////////////////////////////////////////////////

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

configHelper.loadConfigFromHost(configHost,configPath)
  .then(result => {
    try {

      log.debug("Config leida con EXITO:"+JSON.stringify(result));
      configHelper.setConfig(result);

      //With the configuration loaded, we can use the Authentication Service
      var authenticationService = require('./api/services/authentication.service.js');

      SwaggerExpress.create(config, function (err, swaggerExpress) {

        if (err) {
          throw err;
        }

        var port = process.env.PORT || 8080;
        app.listen(port);
        log.debug(`Application started on port ${port}`);
        // Enable CORS
        app.use(cors());
        // Validate token in private routes
        app.all('/globatalent/api/private/*', authenticationService.validateToken);

        // Check user is the same token in private home routes
        app.all('/globatalent/api/private/home/:username/*', authenticationService.checkUser);

        app.get('/payment_callback/:username', (req, res) => {

          var transactionId = req.param('transactionId');
          var username = req.param('username');

          var options = {
            uri: 'https://api.sandbox.mangopay.com/v2.01/blockchainust/payins/'+transactionId,
            headers: {
              Authorization: paymentToken
            },
            json: true // Automatically parses the JSON string in the response
        };
         
        rp(options)
            .then(function (result) {
              // Maybe CreditedFunds.Amount
              return investmentsService.increaseUserFunds(username,result.DebitedFunds.Amount);
            })
            .then(() => {
              res.redirect(`${process.env.FRONT_HOST}/#/home`);
            })
            .catch(function (err) {
              log.error(JSON.stringify(err));
            });

        });
        // Install middleware
        swaggerExpress.register(app);
      });

    } catch (err) {
    log.error(err);
  }
});
