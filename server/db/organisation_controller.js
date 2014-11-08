// var mongoose = require('mongoose');
// var db = mongoose.connection;
// mongoose.connect('localhost', 'test');
var Organisation = require('hoist-model').Organisation;

var OrganisationController = function () {

};

OrganisationController.prototype = {
  index: function () {
    return Organisation.findAsync({});
  },

  show: function (query) {
    // Organisation.find(query, function (err, docs) {
    //   console.log(docs)
    // });
    return Organisation.findAsync(query);
  },

  create: function (options) {
    var newOrg = new Organisation({
      name: options.name,
      gitFolder: options.gitFolder
    });
    newOrg.saveAsync()
    .then(function() {
      return Organisation.findAsync({name: options.name});
    }).then(function(newOrg) {
      console.log(newOrg);
    }).catch(function(err) {
      console.log(err);
    })
    return Organisation.findAsync({name:options.name});
  },

  update: function (info, callback) {
    var query = {name: info.name}
    var update = info.payload;
    Organisation.findOneAndUpdate(query, update, function (err, docs) {
      callback(docs);
    });
  },

  delete: function () {

  },
};

module.exports = OrganisationController;