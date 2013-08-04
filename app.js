
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    models = require('./models');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// database
mongoose.connect('mongodb://localhost/node_restful_tester');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  mongoose.set('debug', true);
}

// routes
models.User.methods(['get', 'post', 'put', 'delete'])
           .register(app, '/api/users');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
