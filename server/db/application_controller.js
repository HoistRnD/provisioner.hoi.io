var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('localhost', 'test');
var Application = require('hoist-model').Application;
var Sanitizer = require('./sanitizer.js')
var sanitizer = new Sanitizer();

var ApplicationController = function () {

};

ApplicationController.prototype = {
  index: function () {
    return Application.findAsync({});
  },

  show: function (query) {
    return  Application.findAsync(query);
  },

  create: function (options) {
    var newApp = new Application({
      organisation: options.organisation,
      name: options.appName,
      gitRepo: sanitizer.sanitize(options.appName)
    });
    return newApp.saveAsync()
    .catch(function(err) {
      console.log(err);
    })
  },

  update: function (info, callback) {
    var query = {name: info.name}
    var update = info.payload;
    if (update.organisation == '-') {
      delete update.organisation
    }
    Application.findOneAndUpdate(query, update, function (err, docs) {
      callback(docs);
    });
  },

  delete: function (query, callback) {
    Application.findOne(query, function (err, app) {
      app.remove( function (err) {
        console.log(err);
        callback();
      })
    })
  }
};

module.exports = ApplicationController;