var server = require('./server.js')

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});