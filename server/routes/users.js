module.exports = function (server) {
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
    path: '/users/{name}/edit',
    handler: function (request, reply) {
      var user;
      return userController.show({name: request.params.name})
      .then(function (res) {
        user = res;
        reply.view('edit_user.hbs', {user: user[0]});
      }).catch(function (err) {
        console.log(err);
      });
    }
  });
};