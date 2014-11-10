var Organisation = require('hoist-model').Organisation;

var OrganisationController = function () {
};

OrganisationController.prototype = {
  index: function () {
    return Organisation.findAsync({});
  },

  show: function (query) {
    return Organisation.findAsync(query);
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
    Organisation.findOneAndUpdate(query, update, function (err, docs) {
      callback(docs);
    });
  },

  delete: function (query, callback) {
    Organisation.findOne(query, function (err, organisation) {
      organisation.remove( function (err) {
        console.log(err);
        callback();
      });
    });
  }
};

module.exports = OrganisationController;