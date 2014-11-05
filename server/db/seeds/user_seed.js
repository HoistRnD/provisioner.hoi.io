var mongoose = require('mongoose');
var User = require('hoist-model').User;
var Chance = require('chance');
var chance = new Chance();
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/test',function(){
  var user = new User({
      organisations: [{_id: '6uQUrDjcvLIuyXC0GaLD'}],
      emailAddresses: [{address: chance.email()}],
      passwordHash: chance.string()
  });
  user.saveAsync()
  .then(function(){
    return User.findAsync({});
  }).then(function(users){
    console.log(users);
  }).catch(function(err){
    console.log(err)
  });
});