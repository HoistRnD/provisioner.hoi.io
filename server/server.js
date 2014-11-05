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
// var mongoose = require('mongoose');
// var db = mongoose.connection;
// mongoose.connect('localhost', 'test');

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
    var callback = function (apps) {
      // console.log(apps)
      reply.view('welcome.hbs', {apps: apps});   
    }
    applicationController.index(callback)
    
    // var apps = applicationController.index();
    // apps.then(console.log("apps"))
    
   //  .then(function () {
   //    var users = userController.index();
   //  })
   //  .then(function () {
   //     var organisations = organisationController.index();
   //  })
   // .then(function () {
   //    reply.view('welcome.hbs', {apps: apps}, {users: users}, {organisations: organisations});
   //  });
    // var callback = function () {
    //   reply.view('welcome.hbs', {apps: apps});   
    // }
     
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});

handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});
