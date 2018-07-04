/**
*	@file
*	@title Entry point to the application as defined in package.json
*	@author : Xinfin.org
*
*/

var express  = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

/**
*	@var index reference to routing file, contains all core endpoints
*	@var users reference to user routing file, contains all user related endpoints
*	@var config reference to config file, contains application configuration
*	@var port application port to listen on
*/
var index = require('./app/routes/index');
var users = require('./app/routes/users');
var config = require('./app/config/config');
var port = config.port || 8001;
ENV = config.ENV;

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
/**
*	@routes '/' route all incoming requests to routes/index.js file
*	@routes '/users' route all request with /users/* pattern to routes/users.js file
*/
app.use('/', index);
app.use('/users', users);

/**
* @throw middleware to catch all errors and forward to error handler
*/

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
* 	@throw middleware to handle all errors
* 	@returns returns formatted error response
*/

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

/**
*	@dev listen to port number as specified in port variable
*/
app.listen(port);
/**
*	@dev expose the application to outside world
*/
exports = module.exports = app;