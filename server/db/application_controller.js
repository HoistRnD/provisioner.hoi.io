var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('localhost', 'test');
var Application = require('hoist-model').Application;

var ApplicationController = function () {

};

ApplicationController.prototype = {
  index: function () {
    return Application.findAsync({});
  },

  // show: function (query) {
  //   Application.find({query}, function (err, docs) {
  //     console.log(docs)
  //   });
  // },

  create: function (options) {
    var newApp = new Application({
      organisation: options.organisation,
      name: options.appName,
      alias: options.alias,
      apiKey: options.apiKey,
      dataKey: options.dataKey
    });
    newApp.saveAsync()
    .then(function() {
      return Application.findAsync({name: options.name});
    }).then(function(newApplication) {
      console.log(newApplication);
    }).catch(function(err) {
      console.log(err);
    })
    return Application.findAsync({name:options.name});
  },

  update: function () {

  },

  delete: function () {

  },
};

module.exports = ApplicationController;