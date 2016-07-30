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
      },
      dist: {
        src: [
          'public/user/depModules.js',
          'public/user/modules/home/controllers/home-controller.js',
          'public/user/modules/client/controllers/client-controller.js',
          'public/user/modules/pilot/controllers/pilot-controller.js',
          'public/user/modules/pilot/controllers/aircraft-controller.js',
          'public/user/modules/pilot/controllers/training-controller.js',
          'public/user/modules/pilot/controllers/pilot-dash-controller.js',
          'public/user/modules/pilot/controllers/pilot-job-details-controller.js',
          'public/user/modules/editor/controllers/editor-controller.js',
          'public/user/modules/visualObserver/controllers/visualObserver-controller.js',
          'public/user/userApp.js',
          'public/user/modules/home/controllers/loginController.js',
          'public/user/modules/home/services/loginService.js',
          'public/user/modules/home/services/home-service.js',
          'public/user/services/loggerService.js',
          'public/user/services/fileUpload.js',
          'public/user/directive/fileUploadDirective.js',
          'public/user/modules/client/services/client-service.js',
          'public/user/modules/pilot/services/pilot-service.js',
          'public/user/services/userServices.js',
          'public/user/services/jobOrderService.js',
          'public/user/services/validation.js',
          'public/user/constants.js',
          'public/user/modules/client/controllers/mapController.js',
          'public/user/modules/client/controllers/paymentController.js',
          'public/user/modules/client/controllers/requestFlightController.js',
          'public/user/modules/client/controllers/jobOrderController.js',
          'public/user/directive/onlyDigits.js',

        ],
        dest: 'public/user/built.js',
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
  grunt.registerTask("default", ["nodemon:dev"]);
  grunt.registerTask("con", ['concat']);
};
