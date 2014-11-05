var Hapi = require('hapi');
var Good = require('good');

var server = new Hapi.Server(3000);

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});
