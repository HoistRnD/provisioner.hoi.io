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

// organisations =========================================
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
    console.log(request.params.name)
    var organisation;
    return organisationController.show({name: request.params.name})
    .then(function (res) {
      organisation = res;
      console.log(organisation)
      reply.view('edit_organisation.hbs', {organisation: organisation[0]})
    })
  }
});

server.route({
  method: 'POST',
  path: '/organisations/{name}/update',
  handler: function (request, reply) {
    return organisationController.update({name: request.params.name, payload: request.payload}, function (docs) {
      reply.redirect('/organisations/' + docs.name)
    })
  }
});

server.route({
  method: 'GET',
  path: '/organisations/{name}/apps/new',
  handler: function (request, reply) {
    console.log(request.params.name)
    return organisationController.show({name: request.params.name})
    .then(function (res) {
      organisation = res
      console.log(res)
      reply.view('new_app.hbs', {organisation: organisation[0]})
    }).catch(function (err) {
      console.log(err)
    });
  }
});

server.route({
  method: 'POST',
  path: '/organisations/{name}/apps/create',
  handler: function (request, reply) {
    var org = request.params.name
    applicationController.create(request.payload)
    .then(function(newApp) {
      reply.redirect('/')
    }).catch(function (err) {
      console.log(err)
    });
  }
});

// apps =========================================
server.route({
  method: 'POST',
  path: '/apps/{name}',
  handler: function (request, reply) {
    var org = request.params.name
    applicationController.create(request.payload)
    .then(function(newApp) {
      reply.redirect('/')
    }).catch(function (err) {
      console.log(err)
    });
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});


handlebars.registerHelper('usersList', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
    out = out + "<a href = '/users/" + items[i].name + "'><li>" + options.fn(items[i]) + "</li></a>";
  }

  return out + "</ul>";
});

handlebars.registerHelper('appsList', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
    out = out + "<a href = '/apps/" + items[i].name + "'><li>" + options.fn(items[i]) + "</li></a>";
  }

  return out + "</ul>";
});

handlebars.registerHelper('organisationsList', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
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
