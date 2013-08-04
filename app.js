
/**
 * Module dependencies.
 */

var express = require('express'),
    //http = require('http'),
    path = require('path'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    models = require('./models');

var app = exports.app = express();

// all environments
app.set('port', process.env.PORT || 3000)
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(exports.app.router)
    .use(express.static(path.join(__dirname, 'public')));

// database
mongoose.connect('mongodb://localhost/node_restful_tester');

// development only
if ('development' == exports.app.get('env')) {
  app.use(express.errorHandler());
  mongoose.set('debug', true);
}

// routes
models.User.methods(['get', 'post', 'put', 'delete'])
           .register(app, '/api/users');

var start = exports.start = function(app, startCallback) {
    var http = require('http');
    http.createServer(app).listen(app.get('port'), function(){
      startCallback();
    });
};

if (require.main === module) {
    start(app, function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}
