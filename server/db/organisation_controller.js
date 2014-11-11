var Organisation = require('hoist-model').Organisation;

var OrganisationController = function () {
};

OrganisationController.prototype = {
  index: function (query) {
    var query = query || {deleted: false}
    return Organisation.findAsync(query);
  },

  show: function (query, key, value) {
    var key = key || 'deleted'
    var value = value || 'false'
    return Organisation.find(query).where(key, value).exec();
  },

  create: function (options) {
    var newOrg = new Organisation({
      name: options.name,
      gitFolder: options.gitFolder
    });
    return newOrg.saveAsync()
    .catch(function(err) {
      console.log(err);
    });
  },

  update: function (info, callback) {
    var query = {name: info.name};
    var update = info.payload;
    return Organisation.findOneAndUpdateAsync(query, update)
    .catch(function (err) {
      console.log(err);
    });
  },

  delete: function (query, callback) {
    var update = {deleted: true}
    return Organisation.findOneAndUpdateAsync(query, update)
    .catch(function (err) {
      console.log(err);
    });
  }
};

module.exports = OrganisationController;