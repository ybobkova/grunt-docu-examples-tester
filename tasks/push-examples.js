module.exports = function(grunt) {
  grunt.registerMultiTask ('push-examples', 'Use push-examples to paste tested examples in the documentation', function() {

    var options = {src: this.filesSrc, tests: this.data.tests};
    var examplesModule = require('./examples');
    var ExamplesClass = examplesModule();
    var examples = new ExamplesClass(options);

    examples.push(options.src);
  });
};