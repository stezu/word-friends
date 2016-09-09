const gulp = require('gulp');
const mocha = require('gulp-mocha');

const source = {
  test: ['test/**/*.test.js']
};

gulp.task('test', () => {
  return gulp.src(source.test)
    .pipe(mocha());
});

gulp.task('default', ['test']);
