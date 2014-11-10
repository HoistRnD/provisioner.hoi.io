var ApplicationController = require('../db/application_controller.js');
var applicationController = new ApplicationController();
var OrganisationController = require('../db/organisation_controller.js');
var organisationController = new OrganisationController();

module.exports = function (server) {
  // apps =========================================
  server.route({
  method: 'GET',
  path: '/apps/{name}',
  handler: function (request, reply) {
    var app;
    applicationController.show({name: request.params.name})
    .then(function(res) {
      app = res[0]
      return organisationController.show({_id: app.organisation})
    }).then(function(res) {
      orgName = res[0].name
      reply.view('app.hbs', {app: app, organisation: orgName});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'GET',
  path: '/apps/{name}/edit',
  handler: function (request, reply) {
    var app;
    return applicationController.show({name: request.params.name})
    .then(function (res) {
      app = res;
      return organisationController.index()
    }).then(function (orgs) {
      reply.view('edit_app.hbs', {app: app[0], organisations: orgs});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'POST',
  path: '/apps/{name}/update',
  handler: function (request, reply) {
    return applicationController.update({name: request.params.name, payload: request.payload}, function (docs) {
      reply.redirect('/apps/' + docs.name);
    })
  }
});

server.route({
  method: 'GET',
  path: '/apps/{name}/delete',
  handler: function (request, reply) {
    return applicationController.delete({name: request.params.name}, function ( ) {
      reply.redirect('/');
    })
  }
});
};