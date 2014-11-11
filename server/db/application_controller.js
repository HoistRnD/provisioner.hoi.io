var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');
var Application = require('hoist-model').Application;
var Sanitizer = require('./sanitizer.js');
var sanitizer = new Sanitizer();

var ApplicationController = function () {

};

ApplicationController.prototype = {
  index: function (query) {
    var query = query || {deleted: false}
    return Application.findAsync(query);
  },

  show: function (query, key, value) {
    var key = key || 'deleted'
    var value = value || 'false'
    return Application.find(query).where(key, value).exec();
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
    });
  },

  update: function (info, callback) {
    var query = {name: info.name};
    var update = info.payload;
    if (update.organisation == '-') {
      delete update.organisation;
    }
    return Application.findOneAndUpdateAsync(query, update)
    .catch(function (err) {
      console.log(err);
    });
  },

  delete: function (query) {
    var update = {deleted: true}
    return Application.findOneAndUpdateAsync(query, update)
    .catch(function (err) {
      console.log(err);
    });
  }
};

module.exports = ApplicationController;