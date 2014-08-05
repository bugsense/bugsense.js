/*global module:false */
module.exports = function(grunt) {
  // we should add tests
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    concat: {
      'specs/build/specs.js':[
        'specs/instanceSpecs.js',
        'specs/extraDataSpecs.js',
        'specs/breadcrumbsSpecs.js',
        'specs/sendDataSpecs.js',
        'specs/eventsApiSpecs.js',
        'specs/parseSpecs.js',
        'specs/generateExceptionDataSpecs.js',
        'specs/notifySpecs.js',
        'specs/cacheSpecs.js',
        'specs/errorHashSpecs.js'
      ],
      'lib/bugsense.js': [
        'src/libs/bowser.js',
        'src/libs/tracekit.js',
        'src/libs/utils.js',
        'src/libs/lockr.js',
        'src/libs/md5.js',
        'src/bugsense.core.js',
        'src/crashes.js',
        'src/channel.js',
        'src/cache.js',
        'src/errors.js',
        'src/sessions.js',
        'src/network.js'
      ]
    },
    rig: {
      amd: {
        files: {
          'lib/amd/bugsense.js': ['src/amd.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 7000
        }
      }
    },
    jasmine: {
      src: 'lib/bugsense.js',
      options: {
        host: 'http://localhost:7000/',
        specs:  'specs/build/specs.js',
        helpers: 'specs/libs/sinon.js',
        keepRunner: true
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      regular: {
        files: {
          'lib/bugsense.min.js': ['lib/bugsense.js']
        }
      },
      amd: {
        files: {
          'lib/amd/bugsense.min.js': ['lib/amd/bugsense.js']
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: [
          'src/**/*.js',
          'specs/**/*.js'
        ],
        tasks: ['specs']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rigger');

  // Default task.
  grunt.registerTask('default', ['concat', 'rig', 'jshint', 'connect', 'jasmine', 'uglify']);
  grunt.registerTask('specs', ['concat', 'jshint', 'connect', 'jasmine', 'uglify']);

};
