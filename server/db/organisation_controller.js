var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('localhost', 'test');
var Organisation = require('hoist-model').Organisation;

var OrganisationController = function () {

};

OrganisationController.prototype = {
  index: function (callback) {
    Organisation.find({}, function (err, docs) {
      console.log(docs);
      callback(docs);
    });
  },

  // show: function (query) {
  //   Organisation.find({query}, function (err, docs) {
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

module.exports = OrganisationController;