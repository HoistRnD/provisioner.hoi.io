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


  create: function (options) {
    var newUser = new User({
      name: options.name,
      organisations: [{_id: '6uQUrDjcvLIuyXC0GaLD'}],
      emailAddresses: [{address: options.emailAddress}],
      password: options.password
    });
    newUser.saveAsync()
    // .then(function() {
    //   return User.findAsync({name: options.name});
    // }).catch(function(err) {
    //   console.log(err);
    // })
    return User.findAsync({name:options.name});
  },

  update: function (info, callback) {
    console.log(info)
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
      console.log(update.organisation)
      if ( _.difference(newOrg, user.organisations).length > 0 && update.organisation !== '-') {
        user.organisations.push(update.organisation);
      }
      if (update.emailAddress && ( _.difference(newEmail, user.emailAddresses).length > 0)) {
        user.emailAddresses.push({address: update.emailAddress});
      }
      if (update.removeEmailAddress) {
        for (var i=0; i < user.emailAddresses.length; i++) {
          console.log(user.emailAddresses[i]._id)
          console.log( update.removeEmailAddress)
          if (user.emailAddresses[i]._id == update.removeEmailAddress) {
            console.log("if")
            user.emailAddresses.splice(i, 1);
          }
        }
      }

      if (update.removeOrganisation) {
        console.log("remove org")
        for (var i=0; i < user.organisations.length; i++) {
          console.log(user.organisations[i])
          console.log( update.removeOrganisation)
          if (user.organisations[i] == update.removeOrganisation) {
            console.log("if org")
            user.organisations.splice(i, 1);
          }
        }
      }
      user.name = update.name
      user.save(function (err) {
        console.log(err)
      callback(user);
      })
    });
  },

  delete: function (query, callback) {
    User.findOne(query, function (err, user) {
      user.remove( function (err) {
        console.log(err);
        callback();
      })
    })
  }
};

module.exports = UserController;