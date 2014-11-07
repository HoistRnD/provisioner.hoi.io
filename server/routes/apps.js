module.exports = function (server) {
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
};