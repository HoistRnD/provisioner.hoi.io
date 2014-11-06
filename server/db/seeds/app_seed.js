var mongoose = require('mongoose');
var Application = require('hoist-model').Application;
var Chance = require('chance');
var chance = new Chance();
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/test',function(){
  var app1 = new Application({
      organisation: '6uQUrDjcvLIuyXC0GaLD',
      name: chance.word(),
      alias: 'fakeAlias',
      apiKey: chance.string(),
      dataKey: chance.string(),
      anonymousPermissions: {
        dev: ['dev permissions'],
        test: ['test permissions'],
        live: ['live permissions']
      },
      settings: {
        dev:'dev settings',
        test: 'test settings',
        live: 'live settings',
      },
      lastDeploy: {
        dev: chance.birthday(),
        test: chance.birthday(),
        live: chance.birthday()
      },
  });
  app1.saveAsync()
  .then(function(){
    return Application.findAsync({});
  }).then(function(applications){
    console.log(applications);
  }).catch(function(err){
    console.log(err);
  });
});