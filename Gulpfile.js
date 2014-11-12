'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var clean = require('gulp-rimraf');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var jshint = require('gulp-jshint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var coverageEnforcer = require('gulp-istanbul-enforcer');
var globs = {
  images: [
    'client/src/**/*.jpg',
    'client/src/**/*.jpeg',
    'client/src/**/*.gif',
    'client/src/**/*.png'
  ],
  js: {
    client: ['client/src/**/*.js'],
    server: ['server/**/server.js'],
    gulpfile: ['Gulpfile.js'],
    specs: ['specs/**/*.js']
  },
  css: ['client/src/**/*.css'],
  specs: ['specs/**/*specs.js'],
  built: ['client/built'],
  templates: ['server/templates/**/*']
};

function runJshint() {
  return gulp.src(
      globs.js.client.concat(
        globs.js.server,
        globs.js.gulpfile,
        globs.js.specs)
    )
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

gulp.task('jshint-build', function () {
  return runJshint().pipe(jshint.reporter('fail'));
});
gulp.task('jshint', function () {
  return runJshint();
});

gulp.task('clean', function () {
  return gulp.src(globs.built, {
    read: false
  }).pipe(clean());
});
gulp.task('image-copy', function () {
  return gulp.src(globs.images)
  .pipe(gulp.dest('client/built/images/'));
});

gulp.task('images', function () {
  return gulp.src(globs.images)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('client/built/images/'));
});


// Parse and compress JS and JSX files

gulp.task('javascript', function () {
  return gulp.src(globs.js.client)
    .pipe(react())
    .pipe(gulp.dest('client/built/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('client/built/'));
});

// Browserify the source tree into a client-side library

function browserifyTask() {
  return gulp.src('client/built/javascript/client.js')
    .pipe(browserify({
      transform: ['envify']
    }))
    .pipe(rename('compiled.js'))
    .pipe(gulp.dest('client/built/javascript/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('client/built/javascript/'));
}

gulp.task('browserify', ['javascript'], browserifyTask);
gulp.task('browserify_nodep', browserifyTask);

// Compile and minify less

gulp.task('styles', function () {
  return gulp.src(globs.css)
    .pipe(sass())
    .pipe(gulp.dest('client/built/'))
    .pipe(minifycss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('client/built/'));
  //.pipe(livereload());
});

function mochaServer(reporter) {
  return gulp.src(globs.specs, {
      read: false
    })
    .pipe(mocha({
      reporter: reporter || 'nyan'
    }));
}
// Testing
var coverageOptions = {
  dir: './coverage',
  reporters: ['html', 'lcov', 'text-summary', 'html'],
  reportOpts: {
    dir: './coverage'
  }
};
gulp.task('mocha-server-continue', function (cb) {
  gulp.src(globs.js.server)
    .pipe(istanbul())
    .on('finish', function () {
      mochaServer().on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
      }).pipe(istanbul.writeReports(coverageOptions))
        .on('end', cb);

    });
});
gulp.task('enforce-coverage',['mocha-server'], function () {
  var options = {
    thresholds: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 80
    },
    coverageDirectory: 'coverage',
    rootDirectory: 'server'
  };
  return gulp.src(globs.js.server)
    .pipe(coverageEnforcer(options));
});
gulp.task('mocha-server', function (cb) {
  gulp.src(['server/**/*.js'])
    .pipe(istanbul())
    .on('finish', function () {
      mochaServer('spec')
        .pipe(istanbul.writeReports(coverageOptions))
        .on('end', cb);
    });
});
gulp.task('watch', ['clean'], function () {
  var watching = false;
  gulp.start('browserify',
    'styles',
    'images',
    'jshint',
    'mocha-server-continue', function () {
      // Protect against this function being called twice
      if (!watching) {
        watching = true;
        livereload.listen();
        gulp.watch(globs.built.concat(globs.templates))
          .on('change', livereload.changed);
        gulp.watch(globs.js.client, ['javascript']);
        gulp.watch('client/built/javascript/client.js', ['browserify_nodep']);
        gulp.watch(globs.css, ['styles']);
        gulp.watch(globs.js.client.concat(
          globs.js.server,
          globs.js.gulpfile,
          globs.js.specs), ['jshint']);
        gulp.watch(globs.images, ['images']);
        gulp.watch(globs.js.specs.concat(
          globs.js.server), ['mocha-server-continue']);
        nodemon({
          script: 'server/app.js',
          watch: globs.built.concat(globs.js.server)
        });
      }
    });
});
gulp.task('test', ['clean'], function () {
  return gulp.start('jshint-build',
    'browserify',
    'styles',
    'images',
    'mocha-server',
    'enforce-coverage');
});
gulp.task('build', ['clean'], function () {
  return gulp.start('jshint-build',
    'browserify',
    'styles',
    'images',
    'mocha-server',
    'enforce-coverage');
});
gulp.task('default', ['clean'], function () {
  return gulp.start('jshint-build',
    'browserify',
    'styles',
    'images',
    'mocha-server',
    'enforce-coverage');
});