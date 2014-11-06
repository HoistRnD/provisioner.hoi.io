var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var ApplicationController = require('./db/application_controller.js');
var OrganisationController = require('./db/organisation_controller.js');
var UserController = require('./db/user_controller.js');
var applicationController = new ApplicationController();
var organisationController = new OrganisationController();
var userController = new UserController();
var server = new Hapi.Server(3000);
var handlebars = require('handlebars');

server.views({
    engines: {
      hbs: handlebars
    },
    path: Path.join(__dirname, '/templates'),
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    var apps, users, organisations;
    return applicationController.index()
    .then(function (res) {
      apps = res
      return organisationController.index()
    }).then(function (res) {
      organisations = res
      return userController.index()
    }).then(function (res) {
      users = res
      reply.view('welcome.hbs', {apps: apps, organisations: organisations, users: users})
    }).catch(function (err) {
      console.log(err)
    });
  }
});

server.route({
  method: 'GET',
  path: '/apps/new',
  handler: function (request, reply) {
    return organisationController.index()
    .then(function (res) {
      organisations = res
      reply.view('new_app.hbs', {organisations: organisations})
    }).catch(function (err) {
      console.log(err)
    });
  }
});

server.route({
  method: 'POST',
  path: '/apps/create',
  handler: function (request, reply) {
    applicationController.create(request.payload)
    .then(function(newApp) {
      reply.redirect('/')
    })
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});

handlebars.registerHelper('table', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>0; i--) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});


handlebars.registerHelper('usersList', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
    console.log(items[i].name)
    out = out + "<a href = '/users/" + items[i].name + "'><li>" + options.fn(items[i]) + "</li></a>";
  }

  return out + "</ul>";
});

handlebars.registerHelper('organisationsList', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
    console.log(items[i].name)
    out = out + "<a href = '/organisations/" + items[i].name + "'><li>" + options.fn(items[i]) + "</li></a>";
  }

  return out + "</ul>";
});


handlebars.registerHelper('dropDown', function(items, options) {
  var out = "<select name = 'organisation'>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});
