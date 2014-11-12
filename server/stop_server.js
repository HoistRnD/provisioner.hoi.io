var server = require('./server.js')
var mongoose = require('mongoose');
var config = require('config')

server.start(function () {
  mongoose.connect(config.get('Hoist.mongo.db'));
  console.log('info', 'Server running at: ' + server.info.uri);
});