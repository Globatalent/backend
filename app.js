'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var Log = require('log');
var cors = require('cors');

var configHelper = require('./api/helpers/config.helper');

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

// Host y puerto del que obtener la configuracion de la aplicacion
var configHost = process.env.CONFIG_HOST;
var configPath = process.env.CONFIG_PATH;

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
        // Install middleware
        swaggerExpress.register(app);
      });

    } catch (err) {
    log.error(err);
  }
});
