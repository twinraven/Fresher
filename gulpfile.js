var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// TASKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('styles', function() {
    return sass('src/scss/main.scss', { style: 'compressed' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});


gulp.task('scripts', function() {
    return gulp.src(['src/js/**/*.js', '!_*.js', '!src/js/libs/**/*', '!src/js/build.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('build.js'))
        .pipe(gulp.dest('src/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});


gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});


gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'));
});


gulp.task('copy-to-dist', function() {
  return gulp.src(['src/index.html', 'src/favicon*.ico', 'src/manifest.json', 'src/fonts', 'src/partials'])
    .pipe(gulp.dest('dist'));
});


gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/images'], cb);
});


gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});


gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'copy-to-dist');
});


gulp.task('server', ['connect', 'watch']);

// WATCH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

});