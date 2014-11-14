var UserController = require('../controllers/user_controller.js');
// var userController = new UserController();
var OrganisationController = require('../controllers/organisation_controller.js');
// var organisationController = new OrganisationController();
var BBPromise = require('bluebird');
var _ = require('lodash');

module.exports = function (server) {
 server.route({
  method: 'GET',
  path: '/users/{name}',
  handler: function (request, reply) {
    var user;
    UserController.show({name: request.params.name})
    .then(function(userResult) {
      user = userResult[0];
      var organisations = [];
      for (var i=0; i < user.organisations.length; i++) {
        organisations.push(OrganisationController.show({_id: user.organisations[i]}));
      }
      return BBPromise.all(organisations);
    }).then(function(orgs) {
      var orgNames = _.flatten(orgs);
      reply.view('user.hbs', {user: user, orgNames: orgNames, title: request.params.name }, {layout: 'layout'});
    });
  }
});

server.route({
  method: 'GET',
  path: '/users/new',
  handler: function (request, reply) {
    return OrganisationController.index()
    .then(function (organisations) {
      reply.view('new_user.hbs', {organisations: organisations, title: 'New User' }, {layout: 'layout'});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'POST',
  path: '/users/create',
  handler: function (request, reply) {
    return UserController.create(request.payload)
    .then(function(user) {
      reply.redirect('/');
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'GET',
  path: '/users/{name}/edit',
  handler: function (request, reply) {
    var user;
    return UserController.show({name: request.params.name})
    .then(function (userResult) {
      user = userResult[0];
      return OrganisationController.index();
    }).then(function (organisations) {
      reply.view('edit_user.hbs', {user: user, organisations: organisations, title: 'Edit ' + request.params.name }, {layout: 'layout'});
    });
  }
});

server.route({
  method: 'POST',
  path: '/users/{name}/update',
  handler: function (request, reply) {
    return UserController.update({name: request.params.name, payload: request.payload})
    .then(function (user) {
      reply.redirect('/users/' + user[0].name);
    });
  }
});

server.route({
  method: 'GET',
  path: '/users/{name}/confirm-delete',
  handler: function (request, reply) {
    reply.view('confirm_delete.hbs', {title: 'Confirm Delete', type: 'users', name: request.params.name}, {layout: 'layout'});
  }
});

server.route({
  method: 'GET',
  path: '/users/{name}/delete',
  handler: function (request, reply) {
    return UserController.delete({name: request.params.name})
    .then(function () {
      reply.redirect('/');
    });
  }
});
};