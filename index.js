/**
* variables and imports
**/

const express = require('express'),
    pubRouter = express.Router(),
    bodyParser = require('body-parser'),
    path = require('path');

/**
* routes
**/

// public api
// require('./api/routes/apiUsers')(pubRouter);

// TODO: private api

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.PORT;

// define the express application
const app = express();

/**
* middleware
**/

// allows access to post values via request.body
// https://github.com/expressjs/body-parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

/**
* serve content
**/

// api routes
app.use('/api/public/v1', pubRouter);
// TODO: app.use('/api/private/v1', pubRouter);

// all other routes not specified will be handled as a 404
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'The resource you are looking for does not exist or has been moved.'
    });
});


const server = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('\nListening at http://localhost:' + config.PORT + '\n');
});

module.exports = server;
