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
});
