var ApplicationController = require('../db/application_controller.js');
var applicationController = new ApplicationController();
var OrganisationController = require('../db/organisation_controller.js');
var organisationController = new OrganisationController();

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/apps/{name}',
    handler: function (request, reply) {
      var app, orgName;
      return applicationController.show({name: request.params.name})
      .then(function(res) {
        app = res[0];
        return organisationController.show({_id: app.organisation});
      }).then(function(res) {
        orgName = res[0].name;
        reply.view('app.hbs', {app: app, organisation: orgName, title: request.params.name}, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/apps/{name}/edit',
    handler: function (request, reply) {
      var app, orgs, orgName;
      return applicationController.show({name: request.params.name})
      .then(function (res) {
        app = res[0];
        return organisationController.index();
      }).then(function (res) {
        orgs = res;
        return organisationController.show({_id: app.organisation});
      }).then(function (res) {
        console.log(orgs)
        orgName = res[0].name;
        reply.view('edit_app.hbs', {app: app, organisations: orgs, orgName: orgName, title: 'Edit ' + request.params.name}, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/apps/{name}/update',
    handler: function (request, reply) {
      return applicationController.update({name: request.params.name, payload: request.payload})
      .then(function (apps) {
        reply.redirect('/apps/' + apps.name);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/apps/{name}/delete',
    handler: function (request, reply) {
      return applicationController.delete({name: request.params.name})
      .then(function () {
        reply.redirect('/');
      });
    }
  });
};