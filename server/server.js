var Hapi = require('hapi');
var OrganisationController = require('./controllers/organisation_controller.js');
var UserController = require('./controllers/user_controller.js');
var organisationController = new OrganisationController();
var userController = new UserController();
var server = new Hapi.Server(3000);
module.exports = server;
var organisationRoutes = require('./routes/organisations');
var userRoutes = require('./routes/users');
var applicationRoutes = require('./routes/apps');
var handlebars = require('handlebars');
var path = require('path');
var HandlebarsHelpers = require('./handlebars_helpers.js')


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

HandlebarsHelpers(handlebars)

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
    var organisations;
    return organisationController.index()
    .then(function (orgs) {
      organisations = orgs;
      return userController.index();
    }).then(function (users) {
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
