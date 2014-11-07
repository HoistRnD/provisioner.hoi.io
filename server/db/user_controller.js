// var mongoose = require('mongoose');
// var db = mongoose.connection;
// mongoose.connect('localhost', 'test');
var _ = require('lodash');
var User = require('hoist-model').HoistUser;

var UserController = function () {

};

UserController.prototype = {
  index: function () {
    return User.findAsync({});
  },

   show: function (query) {
    return User.findAsync(query);
  },


  create: function () {

  },

  update: function (info, callback) {
    var query = {name: info.name};
    var user;
    var update = info.payload;
    User.findOne(query, function (err, user) {
      var newOrg = [];
      var removeOrg = [];
      var newEmail = [];
      newOrg.push(update.organisation)
      newEmail.push(update.emailAddress)
      // if you add and delete at the same time what happens??
      if ( _.difference(newOrg, user.organisations).length > 0) {
        user.organisations.push(update.organisation);
      }
      if (update.emailAddress && ( _.difference(newEmail, user.emailAddresses).length > 0)) {
        user.emailAddresses.push({address: update.emailAddress});
      }
      if (update.removeEmailAddress) {
        console.log("remove")
      var index =  user.emailAddresses.indexOf({address: update.removeEmailAddress})
      console.log(index)
        if (index >= 0) {
           user.emailAddresses.splice(index, 1);
        }
      }
      user.name = update.name
      user.save(function (err) {
        console.log(err)
      callback(user);
      })
    });
  //   User.findOneAndUpdate(query, update, function (err, docs) {
  //     callback(docs);
  //   });
  },

  delete: function (query, callback) {
    User.findOne(query, function (err, user) {
      user.remove( function (err) {
        console.log(err);
        callback();
      })
    })
  },
};

module.exports = UserController;