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
    return newUser.saveAsync()
    .catch(function(err) {
      console.log(err);
    })
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
      if ( _.difference(newOrg, user.organisations).length > 0 && update.organisation !== '-') {
        user.organisations.push(update.organisation);
      }
      if (update.emailAddress && ( _.difference(newEmail, user.emailAddresses).length > 0)) {
        user.emailAddresses.push({address: update.emailAddress});
      }
      if (update.removeEmailAddress) {
        for (var i=0; i < user.emailAddresses.length; i++) {
          if (user.emailAddresses[i]._id == update.removeEmailAddress) {
            user.emailAddresses.splice(i, 1);
          }
        }
      }

      if (update.removeOrganisation) {
        for (var i=0; i < user.organisations.length; i++) {
          if (user.organisations[i] == update.removeOrganisation) {
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