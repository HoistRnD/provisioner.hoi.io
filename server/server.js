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
module.exports = server;
// require('./routes')(server);
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
layouts.register(handlebars);
var path = require('path');
var fs = require("fs");


server.views({
    engines: {
      hbs: handlebars
    },
    path: Path.join(__dirname, '/templates'),
});

server.route({
   method: 'GET',
   path: '/css/{param*}',
   handler: {
     directory: {
       path: path.resolve(__dirname, '../client/src/styles')
     }
   }
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

// // organisations =========================================
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
  method: 'GET',
  path: '/organisations/new',
  handler: function (request, reply) {
    reply.view('new_organisation.hbs');
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
    })
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

// apps =========================================
server.route({
  method: 'GET',
  path: '/apps/{name}',
  handler: function (request, reply) {
    var app;
    applicationController.show({name: request.params.name})
    .then(function(res) {
      app = res
      reply.view('app.hbs', {app: app[0]});
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
      reply.view('edit_app.hbs', {app: app[0]});
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



// users =========================================
server.route({
  method: 'GET',
  path: '/users/{name}',
  handler: function (request, reply) {
    var user;
    userController.show({name: request.params.name})
    .then(function(res) {
      user = res
      reply.view('user.hbs', {user: user[0]});
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



server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});

// handlebars.registerPartial('layout', fs.readFileSync('./templates/layout.hbs', 'utf8'));


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


handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";

  for(var i=items.length -1; i>=0; i--) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});


handlebars.registerHelper('addOrgDropDown', function(items, options) {
  var out = "<select name = 'organisation'>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});

handlebars.registerHelper('removeEmailDropDown', function(items, options) {
  var out = "<select name = 'removeEmailAddress'><option>- </option>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i] + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});

handlebars.registerHelper('removeOrgDropDown', function(items, options) {
  var out = "<select name = 'removeOrganisation'>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});
