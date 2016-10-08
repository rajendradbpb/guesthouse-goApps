module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['app.js']
    },
    watch: {
      scripts: {
        files: ['app.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
          spawn: false,
        },
      },
      css: {
        files: ['**/*.css'],
        options: {
          livereload: true,
        }
      },
    },
    nodemon: {
      dev: {
        script: './bin/www',
        tasks: ['watch']
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today() %> */\n',
      },
      dist: {
        src: [
          "public/main_app.js",
          "public/controllers/commons/MainController.js",
          "public/controllers/commons/signInController.js",
          "public/controllers/commons/userController.js",
          "public/controllers/commons/customerController.js",
          "public/controllers/commons/guestHouseController.js",
          "public/controllers/transactionController.js",
          "public/services/commons/commonService.js",
          "public/services/commons/userService.js",
          "public/services/commons/customerService.js",
          "public/services/commons/guestHouseService.js",
          "public/services/commons/utilityService.js",
          "public/services/transactionService.js",
          "public/config/constants.js",
          "public/directives/transaction-details.js",
          "public/directives/roomFilter.js",
          "public/directives/dateViewer.js",
          "public/directives/report-details-directive.js",
          "public/filters/datefilter.js",

        ],
        dest: 'public/built.js',
      },
    },

  });

  // loading tasks modules
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks("grunt-concurrent")


  // registerTask
  grunt.registerTask("default", ["concat","nodemon:dev"]);
  grunt.registerTask("con", ['concat']);
};
