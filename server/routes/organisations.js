var OrganisationController = require('../controllers/organisation_controller.js');
var organisationController = new OrganisationController();
var ApplicationController = require('../controllers/application_controller.js');
var applicationController = new ApplicationController();

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/organisations/{name}',
    handler: function (request, reply) {
      var organisation;
      return organisationController.show({name: request.params.name})
      .then(function (org) {
        organisation = org[0];
        return applicationController.show({organisation: organisation._id});
      }).then(function (apps) {
          reply.view('organisation.hbs', {organisation: organisation, apps: apps, title: request.params.name }, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/edit',
    handler: function (request, reply) {
      return organisationController.show({name: request.params.name})
      .then(function (organisation) {
        reply.view('edit_organisation.hbs', {organisation: organisation[0], title: 'Edit ' + request.params.name}, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/new',
    handler: function (request, reply) {
      reply.view('new_organisation.hbs', {title: 'New Organisation'}, {layout: 'layout'});
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/create',
    handler: function (request, reply) {
      return organisationController.create(request.payload)
      .then(function(newOrganisation) {
        reply.redirect('/');
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/{name}/update',
    handler: function (request, reply) {
      return organisationController.update({name: request.params.name, payload: request.payload})
      .then(function (organisation) {
        reply.redirect('/organisations/' + organisation.name);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/delete',
    handler: function (request, reply) {
      return organisationController.delete({name: request.params.name})
      .then(function () {
        reply.redirect('/');
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/apps/new',
    handler: function (request, reply) {
      return organisationController.show({name: request.params.name})
      .then(function (organisation) {
        reply.view('new_app.hbs', {organisation: organisation[0], title: 'New App'}, {layout: 'layout'});
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/{name}/apps/create',
    handler: function (request, reply) {
      return applicationController.create(request.payload)
      .then(function() {
        reply.redirect('/organisations/' + request.params.name);
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

};