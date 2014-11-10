var Hapi = require('hapi');
// var Good = require('good');
var OrganisationController = require('./db/organisation_controller.js');
var UserController = require('./db/user_controller.js');
var organisationController = new OrganisationController();
var userController = new UserController();
var server = new Hapi.Server(3000);
module.exports = server;
var organisationRoutes = require('./controllers/organisations');
var userRoutes = require('./controllers/users');
var applicationRoutes = require('./controllers/apps');

// require('./routes')(server);
var handlebars = require('handlebars');
// var layouts = require('handlebars-layouts'(handlebars);
// layouts.register(handlebars);
var path = require('path');
var fs = require("fs");
var Promise = require("node-promise").Promise;


server.views({
    engines: {
      hbs: handlebars
    },
    path: path.join(__dirname, '/templates'),
});

organisationRoutes(server);
userRoutes(server);
applicationRoutes(server);

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
   path: '/images/{param*}',
   handler: {
     directory: {
       path: path.resolve(__dirname, '../client/src/images')
     }
   }
 });

// Home page ==========================================================
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    var users, organisations;
    return organisationController.index()
    .then(function (res) {
      organisations = res
      return userController.index()
    }).then(function (res) {
      users = res
      reply.view('welcome.hbs', {organisations: organisations, users: users})
    }).catch(function (err) {
      console.log(err)
    });
  }
});

//  server start =============================================================
server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});


//  handlebars reguster helpers ==========================================================

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
  var out = "<select name = 'organisation' class='dropdown title'><option>- </option>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});

handlebars.registerHelper('removeEmailDropDown', function(items, options) {
  var out = "<select name = 'removeEmailAddress' class='dropdown title'><option>- </option>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});

handlebars.registerHelper('removeOrgDropDown', function(items, options) {
  var out = "<select name = 'removeOrganisation' class='dropdown title'><option>- </option>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
  }

  return out + "</select>";
});

handlebars.registerHelper('userEmailsList', function(items, options) {
  var out = "<p>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out +  options.fn(items[i]) + ", ";
  }

  return out + "</p>";
});
