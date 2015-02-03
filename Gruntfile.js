'use strict'

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    // make JS small
    uglify: {
      my_target: {
        files: {
          'js/main.min.js' : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/knockoutjs/dist/knockout.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/bootstrap-material-design/dist/js/material.min.js',
            'bower_components/bootstrap-material-design/dist/js/ripples.min.js',
            'js/app.js'
          ]
        }
      }
    },
    // make CSS small
    cssmin: {
      target: {
        files: {
          'css/styles.min.css': [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap-material-design/dist/css/material-wfont.min.css',
            'bower_components/bootstrap-material-design/dist/css/ripples.min.css',
            'css/main.css'
          ]
        }
      }
    },
    // make HTML small
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.html': 'index.premin.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Register default tasks
  grunt.registerTask('build', ['cssmin', 'uglify', 'htmlmin']);
}
