const gulp = require('gulp');
const mocha = require('gulp-mocha');

const source = {
  test: ['test/**/*.test.js']
};

gulp.task('test', () => {
  return gulp.src(source.test)
    .pipe(mocha({
      timeout: 10000
    }));
});

gulp.task('default', ['test']);
