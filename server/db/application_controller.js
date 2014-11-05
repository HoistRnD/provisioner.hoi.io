var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('localhost', 'test');
var Application = require('hoist-model').Application;

var ApplicationController = function () {

};

ApplicationController.prototype = {
  index: function (callback) {
    // var apps = Application.find({_id : "yULtLxc6wcgsq259lnhY"});
    Application.find({}, function (err, docs) {
      // console.log(docs);
      callback(docs);
    });
  },

  // show: function (query) {
  //   Application.find({query}, function (err, docs) {
  //     console.log(docs)
  //   });
  // },

  create: function () {

  },

  update: function () {

  },

  delete: function () {

  },
};

module.exports = ApplicationController;