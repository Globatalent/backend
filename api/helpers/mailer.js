'use strict';

var nodemailer = require('nodemailer');
var appProperties = require('../helpers/config.helper');

module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: appProperties.getConfig().email, /* Your email id */
        pass: appProperties.getConfig().password /* Your password */
    }
});
