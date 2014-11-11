var User = require('hoist-model').HoistUser;

var UserController = function () {
};

UserController.prototype = {
  index: function (query) {
    var query = query || {deleted: false}; 
    return User.findAsync(query);
  },

   show: function (query, key, value) {
    var key = key || 'deleted';
    var value = value || 'false';
    return User.find(query).where(key, value).exec();
  },

  create: function (options) {
    var newUser = new User({
      name: options.name,
      organisations: [{_id: options.organisation}],
      emailAddresses: [{address: options.emailAddress}],
      password: options.password
    });
    return newUser.saveAsync()
    .catch(function(err) {
      console.log(err);
    });
  },

  update: function (info, callback) {
    var query = {name: info.name};
    var update = info.payload;
    return User.findOneAsync(query)
    .then(function (user) {
      user.organisations.addToSet(update.organisation)
      if (update.emailAddress) {
        user.emailAddresses.addToSet({address: update.emailAddress})
      }
      user.emailAddresses.pull({address: update.removeEmailAddress})
      user.organisations.pull(update.removeOrganisation)
      return user.setPassword(update.password)
      .then(function (){
        user.name = update.name;
        return user.saveAsync()
      })
    });
  },

  delete: function (query) {
    var update = {deleted: true}
    return User.findOneAndUpdateAsync(query, update)
    .catch(function (err) {
      console.log(err);
    });
  }
};

module.exports = UserController;