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

describe("pasteName", function () {
  this.timeout(500);

  it("The name and description must be pasted", function (done) {

    setTimeout(done, 300);
    cojokoLoader(['Cojoko'], function (Cojoko) {
      /* beginning of the example */
      // Place for the example
      /* end of the example */
      assert.equal(true, true);

    });
  });
});