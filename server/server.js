var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var ApplicationController = require('./db/application_controller.js')
var applicationController = new ApplicationController();

var server = new Hapi.Server(3000);
var handlebars = require('handlebars')

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
    applicationController.index(function (apps, users, organisations ) {
      reply.view('welcome.hbs', {apps: apps}, {users: users}, {organisations: organisations});   
    });
     
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
