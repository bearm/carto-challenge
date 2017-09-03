var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    streamqueue = require('streamqueue'),
    cleanCSS = require('gulp-clean-css');

gulp.task('default', ['watch']);

gulp.task('build-css', function () {
    return gulp.src('app/assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('app/assets/bundles/css'));
});

gulp.task('build-css-vendor', function () {
    return gulp.src('app/vendor/css/*.css')
        .pipe(concat('vendor.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('app/assets/bundles'));
});

gulp.task('build-js', function () {
    var uglyOptions = {
        mangle: false
    };
    return gulp.src('app/js/*.js')
        .pipe(concat('challenge.min.js'))
        .pipe(gulp.dest('app/assets/bundles'))
        .pipe(uglify(uglyOptions))
        .pipe(gulp.dest('app/assets/bundles'));
});

gulp.task('build-js-vendor', function () {
    var uglyOptions = {
        mangle: false
    };
    return gulp.src('app/vendor/js/*.js')
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('app/assets/bundles'))
        .pipe(uglify(uglyOptions))
        .pipe(gulp.dest('app/assets/bundles'));
});

gulp.task('build', ['build-css', 'build-js', 'build-css-vendor', 'build-js-vendor']);

gulp.task('watch', function () {
    gulp.watch('app/assets/scss/**/*.scss', ['build-css']);
    gulp.watch('app/**/*.js', ['build-js']);
});
