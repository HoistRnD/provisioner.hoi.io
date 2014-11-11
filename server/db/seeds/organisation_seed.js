var mongoose = require('mongoose');
var Organisation = require('hoist-model').Organisation;
var Chance = require('chance');
var chance = new Chance();
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/test',function(){
  var organisation = new Organisation({
    name: chance.word(),
    gitFolder: chance.word()
  });
  organisation.saveAsync()
  .then(function(){
    return Organisation.findAsync({});
  }).then(function(organisations){
    console.log(organisations);
  }).catch(function(err){

  });    
});