/*jshint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var fs = require('fs');
var chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;

var examplesModule = require('../lib/tasks/examples');
var ExamplesClass = examplesModule();

describe('push()', function() {
  it("should use all of the needed functions correctly and change the documentation files correspondingly", function() {
    var options = {src: ['test/files/docu_push_before.txt'], tests: 'test/files/'};
    var examples = new ExamplesClass(options);
    var docu_before = fs.readFileSync(options.src).toString();
    fs.writeFileSync('test/files/docu_push_after.txt', docu_before);
    var docuPaths = 'test/files/docu_push_after.txt';
    examples.push([docuPaths]);
    var docu_after = fs.readFileSync(docuPaths).toString();
    var docu_expected = fs.readFileSync('test/files/docu_push_expected.txt').toString();

    assert.equal(docu_after, docu_expected, 'the example is correctly exported');
  });
});

describe('pull()', function() {

  var options = {tests: 'test/files/', testTemplates: 'test/files/'};
  var examples = new ExamplesClass(options);
  var first_before = fs.readFileSync('test/files/firstExampleTest.js').toString();

  it("should paste examples to the test-files correctly", function() {

    examples.pull(['test/files/docu_pull_exists.txt']);

    var first_after = fs.readFileSync('test/files/firstExampleTest.js').toString();
    var first_expected = fs.readFileSync('test/files/firstExampleTest_expected.js').toString();

    assert.equal(first_after, first_expected, 'the example is correctly exported');

    fs.writeFileSync('test/files/firstExampleTest.js', first_before);
  });

  before(function runBefore() {
    if (fs.existsSync('test/files/secondExampleTest.js')) {
      fs.unlink('test/files/secondExampleTest.js');
    }
  });

  it("should create test-files", function() {
    examples.pull(['test/files/docu_pull_not_exists.txt']);
    assert(fs.existsSync('test/files/secondExampleTest.js'), 'the js-file was not created');
  });

  it("should change created test-files", function() {
    var second_after = fs.readFileSync('test/files/secondExampleTest.js').toString();
    var second_expected = fs.readFileSync('test/files/secondExampleTest_expected.js').toString();
    assert.equal(second_after, second_expected, 'the example is correctly exported');
  });
});

describe('pasteExampleToTest()', function() {
  it('should paste an example to the test-file in an appropriate place', function() {
    var options = {tests: 'test/files/parseExampleTest.js'};
    var examples = new ExamplesClass(options);
    var example = "// Welcome to the jungle!";
    var test = fs.readFileSync(options.tests).toString();
    test = examples.pasteExampleToTest(test, example);

    var expected = 'test/files/parseExampleTest_expected.js';
    var test_expected = fs.readFileSync(expected).toString();

    assert.equal(test, test_expected, 'the example was incorrectly written to the file');
  });
});

describe('readOrCreateTestFile()', function() {

  var options = {src: 'test/files/docu_read_or_create.txt', testTemplates: 'test/files/'};
  var examples = new ExamplesClass(options);
  var parseTestJsPath = 'test/files/parseExampleTest';
  var parseTestFile = fs.readFileSync(parseTestJsPath + '.js').toString();

  it("should return the text of the existing file", function() {
    var readTest = examples.readOrCreateTestFile(parseTestJsPath, options.testTemplates);

    assert(fs.existsSync(parseTestJsPath + '.js'), 'the existing file was not found');
    assert.equal(readTest, parseTestFile, 'the existing file was not read correctly');
  });

  before(function runBefore() {
    if (fs.existsSync('test/files/nonExistingTest.js')) {
      fs.unlink('test/files/nonExistingTest.js');
    }
  });

  it("should create files and return the text of the created js-file", function() {

    var createdTest = examples.readOrCreateTestFile('test/files/nonExistingTest', options.testTemplates);
    var templateJsFile = fs.readFileSync('test/files/docuTestTemplate.js');
    assert(fs.existsSync('test/files/nonExistingTest.js'), 'the js-file was not found');
    assert.equal(createdTest, templateJsFile, 'the created js-file was incorrectly written');

  });
});

describe('pasteNameAndDescriptionToCreatedFiles()', function() {
  var options = {testTemplates: 'test/files/'};
  var examples = new ExamplesClass(options);

  var templatePath = options.testTemplates + 'docuTestTemplate.js';
  var jsComment = "```js\n// pasteNameExample: The name and description must be pasted\n```";
  var templateText = fs.readFileSync(templatePath).toString().trim();

  it("should write name and description of the example to the created js-file", function() {
    var actual = examples.pasteNameAndDescriptionToCreatedFiles(templateText, jsComment);
    var expected = fs.readFileSync('test/files/pasteNameTest_expected.js').toString();    
    fs.writeFileSync(options.testTemplates + 'docuTestTemplate.js', templateText);
    assert.equal(actual, expected, 'the js-file was incorrectly written');
  });
});

describe('parseExamplesFromDocuFile()', function() {
  it("should return an array of examples from the documentation file", function() {
    var options = {src: 'test/files/docu_paste_before.txt'};
    var examples = new ExamplesClass(options);
    var text = fs.readFileSync(options.src).toString();
    var parsedArray = examples.parseExamplesFromDocuFile(text);
    var expectedArray = [ '```js\n// BlaExample: here is the new example pasted\nFirst Example\n```',
  '```js\n// BasicClassExample: Classes can be created\nSecond Example\n```' ];    

    assert.sameMembers(parsedArray, expectedArray, 'the examples are incorrectly parsed');
  });
});

describe('findExampleName()', function() {
  it("should return the name of the example", function() {
    var options = {};
    var examples = new ExamplesClass(options);
    var example = '```js\n// basicClassExample: Classes can be created\nFirst Example\n});\n```';
    var name = examples.findExampleName(example);
    var expectedOutput = ['basicClassExample'];

    assert.equal(name, expectedOutput, 'the name of the example is parsed incorrectly');
  });
});

describe('parseExampleFromTest()', function() {
  it("should return the text of the example from the test file", function() {
    var options = {tests: 'test/files/'};
    var examples = new ExamplesClass(options);
    var parsedExample = examples.parseExampleFromTest('parseExample');  

    assert.equal(parsedExample, '      // Here could be the text of your example.', 'the example is incorrectly parsed from the test file');
  });
});

describe('addCodeFenceAndCommentToExample()', function() {
  it("should return the example with te code fence and comment", function() {
    var options = {};
    var examples = new ExamplesClass(options);
    var example = '// I am a big Cheeseburger';
    var fence = '```js';
    var exampleToPaste = examples.addCodeFenceAndCommentToExample(example, fence);
    assert.equal(exampleToPaste, '```js\n// I am a big Cheeseburger\n```', 'the example has a wrong comment and code fence');
  });
});

describe('pasteExampleToDocs()', function() {
  it("should return the text of the documentation file with the new example", function() {
    var options = {src: 'test/files/docu_paste_before.txt'};
    var examples = new ExamplesClass(options);
    var exampleToPaste = '// I am the new example without code fence and comment';
    var fenceAndComment = '```js\n// BlaExample: here is the new example pasted';
    var docuText = fs.readFileSync(options.src).toString();
    var newDocuText = examples.pasteExampleToDocs(exampleToPaste, docuText, fenceAndComment);
    var resultFile = 'test/files/docu_paste_after.txt';
    var expectedFile = 'test/files/docu_paste_expected.txt';
    fs.writeFileSync(resultFile, newDocuText);
    var docuText_actual = fs.readFileSync(resultFile).toString();
    var docuText_expected = fs.readFileSync(expectedFile).toString();

    assert.equal(docuText_actual, docuText_expected, 'the text of the docufile is incorrectly rewritten');
  });
});
