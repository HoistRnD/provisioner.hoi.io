var server = require('../server.js')

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/organisations/{name}',
    handler: function (request, reply) {
      var organisation, apps;
      return organisationController.show({name: request.params.name})
      .then(function (res) {
        organisation = res
        return applicationController.show({organisation: organisation[0]._id})
      }).then(function (res) {
          apps = res
          console.log(organisation)
          reply.view('organisation.hbs', {organisation: organisation[0], apps: apps})
      }).catch(function (err) {
        console.log(err)
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
        reply.view('edit_organisation.hbs', {organisation: organisation[0]});
      })
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/{name}/update',
    handler: function (request, reply) {
      return organisationController.update({name: request.params.name, payload: request.payload}, function (docs) {
        reply.redirect('/organisations/' + docs.name);
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/organisations/{name}/apps/new',
    handler: function (request, reply) {
      return organisationController.show({name: request.params.name})
      .then(function (res) {
        organisation = res;
        reply.view('new_app.hbs', {organisation: organisation[0]});
      }).catch(function (err) {
        console.log(err);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/organisations/{name}/apps/create',
    handler: function (request, reply) {
      var org = request.params.name
      return applicationController.create(request.payload)
      .then(function(newApp) {
        reply.redirect('/');
      }).catch(function (err) {
        console.log(err);
      });
    }
  });
};