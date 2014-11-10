var OrganisationController = require('../db/organisation_controller.js');
var organisationController = new OrganisationController();
var ApplicationController = require('../db/application_controller.js');
var applicationController = new ApplicationController();

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/organisations/{name}',
    handler: function (request, reply) {
      var organisation, apps;
      return organisationController.show({name: request.params.name})
      .then(function (res) {
        organisation = res;
        return applicationController.show({organisation: organisation[0]._id});
      }).then(function (res) {
          apps = res;
          reply.view('organisation.hbs', {organisation: organisation[0], apps: apps}, {layout: 'layout'});
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/edit',
    handler: function (request, reply) {
      var organisation;
      return organisationController.show({name: request.params.name})
      .then(function (res) {
        organisation = res;
        reply.view('edit_organisation.hbs', {organisation: organisation[0]}, {layout: 'layout'});
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
      return organisationController.update({name: request.params.name, payload: request.payload}, function (docs) {
        reply.redirect('/organisations/' + docs.name);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/delete',
    handler: function (request, reply) {
      return organisationController.delete({name: request.params.name}, function ( ) {
        reply.redirect('/');
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/apps/new',
    handler: function (request, reply) {
      var organisation;
      return organisationController.show({name: request.params.name})
      .then(function (res) {
        organisation = res;
        reply.view('new_app.hbs', {organisation: organisation[0]}, {layout: 'layout'});
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/{name}/apps/create',
    handler: function (request, reply) {
      var org = request.params.name;
      return applicationController.create(request.payload)
      .then(function(newApp) {
        reply.redirect('/organisations/' + org);
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

};