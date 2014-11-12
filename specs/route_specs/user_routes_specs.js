'use strict';
var cheerio = require('cheerio');
var sinon = require('sinon');
var expect = require('chai').expect;
var BBPromise = require('bluebird');
var UserController = require('../../server/controllers/user_controller.js');
var OrganisationController = require('../../server/controllers/organisation_controller.js');
var mongoose = require('mongoose');

describe('routes: users', function () {
  describe('GET /users/{name}', function () {
    var response;
    var server = require('../../server/server.js');
    var $;
    before(function (done) {
      var user = {
        _id: '123456789',
        name: 'test',
        organisations: ['22222222222'],
        emailAddresses: [{address: 'email@test.com'}, {address: 'test@test.com'}]
      };
      var organisationOne = {
        name: 'test-organisation-one',
        gitFolder: 'test folder'
      };

      var organisationTwo = {
        name: 'test-organisation-two',
        gitFolder: 'test folder'
      };
      sinon.stub(UserController, 'show').returns(new BBPromise(function (resolve) {
        resolve([user]);
      }));
      sinon.stub(OrganisationController, 'show').returns(new BBPromise(function (resolve) {
        resolve([organisationOne, organisationTwo]);
      }));

      server.inject({
        method: 'GET',
        url: '/users/test'
      }, function (r) {
        response = r;
        $ = cheerio.load(response.result);
        done();
      });
    });

    after(function (done) {
      UserController.show.restore();
      OrganisationController.show.restore();
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });

    it('should return a 200 [ok] response', function () {
      expect(response.statusCode).to.equal(200);
    });

    it('should display the users organisations', function () {
      expect(response.result).to.include('test-organisation-one');
      expect(response.result).to.include('test-organisation-two');
    });

    it('should display the users email addresses', function () {
      expect(response.result).to.include('email@test.com');
      expect(response.result).to.include('test@test.com');
    });
  });
  
  describe('GET /users/new', function () {
    var response;
    var server = require('../../server/server.js');
    var $;
    before(function (done) {
      var organisationOne = {
        name: 'test-organisation-one',
        gitFolder: 'test folder'
      };

      var organisationTwo = {
        name: 'test-organisation-two',
        gitFolder: 'test folder'
      };
      sinon.stub(OrganisationController, 'index').returns(new BBPromise(function (resolve) {
        resolve([organisationOne, organisationTwo]);
      }));

      server.inject({
        method: 'GET',
        url: '/users/new'
      }, function (r) {
        response = r;
        $ = cheerio.load(response.result);
        done();
      });
    });

    after(function (done) {
      OrganisationController.index.restore();
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });

    it('should return a 200 [ok] response', function () {
      expect(response.statusCode).to.equal(200);
    });

    it('should display a form', function () {
      expect($('form').length).to.equal(1);
    });

    it('should submit the form to /users/create', function () {
      expect($('form').attr('action')).to.equal('/users/create');
    });

    it('should show dropdown for existing organisation in the form', function () {
      var organisations = $('form').find('select.dropdown option');
      expect(organisations.length).to.equal(3)
    });

    it('should show the existing organisations in the dropdown', function () {
      var organisations = $('form').find('select.dropdown option');
      // the first drop down option is a '-'
      expect(organisations["1"].children[0].data).to.equal("test-organisation-one");
      expect(organisations["2"].children[0].data).to.equal("test-organisation-two");
    });

  });

});
