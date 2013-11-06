module.exports = function(grunt) {
  grunt.registerMultiTask ('pull-examples', 'Use push-examples to paste examples from the documentation into the tests', function() {

    var options = {src: this.filesSrc, tests: this.data.tests, testTemplates: this.data.templates};
    var examplesModule = require('./examples');
    var ExamplesClass = examplesModule();
    var examples = new ExamplesClass(options);

    examples.pull(options.src);
  });
};