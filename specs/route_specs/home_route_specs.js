'use strict';
var cheerio = require('cheerio');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var UserController = require('../../server/controllers/user_controller.js');
var OrganisationController = require('../../server/controllers/organisation_controller.js');
var mongoose = require('mongoose');

describe('routes: home', function () {
  describe('GET /', function () {
    var response;
    var server = require('../../server/server.js').server;
    var $;
    before(function (done) {
      var userOne = {
        _id: '123456789',
        name: 'userOne',
        organisations: ['22222222222'],
        emailAddresses: ['email@test.com', 'test@hoistapps.com']
      };
      var userTwo = {
        _id: '123454329',
        name: 'userTwo',
        organisations: ['22222222222'],
        emailAddresses: ['email@hoist.com', 'test@hoist.io']
      };

      var organisationOne = {
        name: 'test-organisation-one',
        gitFolder: 'test folder'
      };

      var organisationTwo = {
        name: 'test-organisation-two',
        gitFolder: 'test folder'
      };
      sinon.stub(UserController, 'index').returns(new BBPromise(function (resolve) {
        resolve([userOne, userTwo]);
      }));
      sinon.stub(OrganisationController, 'index').returns(new BBPromise(function (resolve) {
        resolve([organisationOne, organisationTwo]);
      }));

      server.inject({
        method: 'GET',
        url: '/'
      }, function (r) {
        response = r;
        $ = cheerio.load(response.result);
        done();
      });
    });

    after(function (done) {
      UserController.index.restore();
      OrganisationController.index.restore();
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });

    it('should return a 200 [ok] response', function () {
      expect(response.statusCode).to.equal(200);
    });

    it('should return a list of organisations', function () {
      expect(response.result).to.include('Existing Organisations');
    });

    it('should return a the names of all organisations', function () {
      expect(response.result).to.include('test-organisation-one');
      expect(response.result).to.include('test-organisation-two');
    });

    it('should return a list of users', function () {
      expect(response.result).to.include('Existing Users');
    });

    it('should return a the names of all users', function () {
      expect(response.result).to.include('userOne');
      expect(response.result).to.include('userTwo');
    });
  });
});
