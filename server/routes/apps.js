var ApplicationController = require('../controllers/application_controller.js');
var applicationController = new ApplicationController();
var OrganisationController = require('../controllers/organisation_controller.js');
var organisationController = new OrganisationController();

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/apps/{name}',
    handler: function (request, reply) {
      var app;
      return applicationController.show({name: request.params.name})
      .then(function(application) {
        app = application[0];
        return organisationController.show({_id: app.organisation});
      }).then(function(organisation) {
        var orgName = organisation[0].name;
        reply.view('app.hbs', {app: app, organisation: orgName, title: request.params.name}, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/apps/{name}/edit',
    handler: function (request, reply) {
      var app, orgs;
      return applicationController.show({name: request.params.name})
      .then(function (application) {
        app = application[0];
        return organisationController.index();
      }).then(function (organisations) {
        orgs = organisations;
        return organisationController.show({_id: app.organisation});
      }).then(function (organisation) {
        var orgName = organisation[0].name;
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
    path: '/apps/{name}/confirm-delete',
    handler: function (request, reply) {
      reply.view('confirm_delete.hbs', {title: 'Confirm Delete', type: 'apps', name: request.params.name}, {layout: 'layout'});
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