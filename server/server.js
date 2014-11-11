var Hapi = require('hapi');
var OrganisationController = require('./db/organisation_controller.js');
var UserController = require('./db/user_controller.js');
var organisationController = new OrganisationController();
var userController = new UserController();
var server = new Hapi.Server(3000);
module.exports = server;
var organisationRoutes = require('./routes/organisations');
var userRoutes = require('./routes/users');
var applicationRoutes = require('./routes/apps');
var handlebars = require('handlebars');
var path = require('path');

server.views({
    engines: {
      hbs: handlebars
    },
    path: path.join(__dirname, '/templates'),
    layoutPath: path.join(__dirname, '/templates')
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
      organisations = res;
      return userController.index();
    }).then(function (res) {
      users = res;
      reply.view('welcome.hbs', {organisations: organisations, users: users, title: 'Home'}, {layout: 'layout'});
    }).catch(function (err) {
      console.log(err);
    });
  }
});

//  server start =============================================================
server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});

// handlebars helpers =============================================================

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
