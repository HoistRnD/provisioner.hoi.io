// var mongoose = require('mongoose');
// var db = mongoose.connection;
// mongoose.connect('localhost', 'test');
var User = require('hoist-model').User;

var UserController = function () {

};

UserController.prototype = {
  index: function () {
    User.find({}, function (err, docs) {
      console.log(docs);
      return docs;
    });
  },

  // show: function (query) {
  //   User.find({query}, function (err, docs) {
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

module.exports = UserController;