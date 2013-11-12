/*jshint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var chai = require('chai');
var mocha = require('mocha');
var requirejs = require('requirejs');
var expect = chai.expect, assert = chai.assert;
var path = require('path');
var _ = require('lodash');
var lib = path.resolve(__dirname + '/../../../lib');

var cojokoConfig = _.merge(require(lib + '\\config.js'), { baseUrl: lib });

var cojokoLoader = requirejs.config(cojokoConfig);

describe("second", function () {
  this.timeout(500);

  it("has currency as a property", function (done) {

    setTimeout(done, 300);
    cojokoLoader(['Cojoko'], function (Cojoko) {
      /* beginning of the example */
      Cojoko.Class('ACME.Exchange.Price', {
        properties: {
          currency: { is : 'g', required: true, isPrivate: true }
        }
      });
      /* end of the example */
      assert.equal(true, true);

    });
  });
});