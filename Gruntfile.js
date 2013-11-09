/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var port = 8000;
  var hostname = 'localhost';
  var nodepath = require("path");
  
  var mapToUrl = function(files) {
    var baseUrl = 'http://'+hostname+':'+port+'/';
    
    var urls = grunt.util._.map(
      grunt.file.expand(files),
      function (file) {
        return baseUrl+file;
      }
    );
    
    return urls;
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js', '!test/files/**/*'],
      options: {
        curly: false, /* dont blame for missing curlies around ifs */
        eqeqeq: true,
        immed: true,
        latedef: true,
        devel: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          $: true,
          define: true, require: true,

          Test: true, Psc: true,
          QUnit: true, module: true, stop: true, start: true, ok: true, asyncTest: true, test: true, expect: true
        }
      }
    },
    concat: {
      options: {
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js', 'lib/**/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      dist: {
        src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    }
  });

  grunt.task.registerTask('pack', ['jshint', 'requirejs']);
  grunt.task.registerTask('default', ['jshint']);
  grunt.task.registerTask('travis', ['jshint']);
};
