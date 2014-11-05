var mongoose = require('mongoose');
var Application = require('hoist-model').Application;
var Chance = require('chance');
var chance = new Chance();



var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/test',function(){
  var app1 = new Application({
    organisation: chance.string(),
      name: chance.string(),
      //url alias
      alias: 'fakeAlias',
      apiKey: chance.string(),
      //the app.hoi.io sub domain for hosting
      dataKey: chance.string(),
      anonymousPermissions: {
        dev: ['devString'],
        test: ['testString'],
        live: ['liveString']
      },
      settings: {
        dev:'Schema.Types.Mixed',
        test: 'Schema.Types.Mixed',
        live: 'Schema.Types.Mixed',
      },
      lastDeploy: {
        dev: '01-01-1980',
        test: '01-01-1980',
        live: '01-01-1980'
      },
  });
  app1.saveAsync()
  .then(function(){
    return Application.findAsync({});
  }).then(function(applications){
    console.log(applications);
  }).catch(function(err){

  });
});