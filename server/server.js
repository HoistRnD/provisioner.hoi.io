var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');

var server = new Hapi.Server(3000);

server.views({
    engines: {
        hbs: require('handlebars')
    },
    path: Path.join(__dirname, '/templates'),
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    
    reply.view('welcome.hbs', {});
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});
