var gulp   = require('gulp'),
    sass   = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('build-css', function() {
    return gulp.src('app/assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('app/assets/css'));
});

gulp.task('build', ['build-css']);

gulp.task('watch', function() {
    gulp.watch('assets/styles/sass/**/*.scss', ['sass']);
});
