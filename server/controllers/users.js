var UserController = require('../db/user_controller.js');
var userController = new UserController();
var OrganisationController = require('../db/organisation_controller.js');
var organisationController = new OrganisationController();

module.exports = function (server) {
  // users =========================================
 server.route({
  method: 'GET',
  path: '/users/{name}',
  handler: function (request, reply) {
    var user;
    var organisations = []
    userController.show({name: request.params.name})
    .then(function(res) {
      user = res[0]
      for (var i=0; i < user.organisations.length; i++) {
        organisations.push(organisationController.show({_id: user.organisations[i]}))
      }
      // Promise.all(organisations)
    }).then(function(res) {
    
      reply.view('user.hbs', {user: user });
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'GET',
  path: '/users/new',
  handler: function (request, reply) {
    var organisations;
    return organisationController.index()
    .then(function (res) {
      organisations = res;
      reply.view('new_user.hbs', {organisations: organisations});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'POST',
  path: '/users/create',
  handler: function (request, reply) {
    return userController.create(request.payload)
    .then(function(newUser) {
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
    var user, organisations;
    return userController.show({name: request.params.name})
    .then(function (res) {
      user = res;
      return organisationController.index()
    }).then(function (res) {
      organisations = res;
      reply.view('edit_user.hbs', {user: user[0], organisations: organisations});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

server.route({
  method: 'POST',
  path: '/users/{name}/update',
  handler: function (request, reply) {
    return userController.update({name: request.params.name, payload: request.payload}, function (docs) {
      reply.redirect('/users/' + docs.name);
    })
  }
});

server.route({
  method: 'GET',
  path: '/users/{name}/delete',
  handler: function (request, reply) {
    return userController.delete({name: request.params.name}, function ( ) {
      reply.redirect('/');
    })
  }
});
};