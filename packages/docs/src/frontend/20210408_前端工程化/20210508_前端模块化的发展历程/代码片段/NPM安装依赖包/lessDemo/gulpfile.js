const gulp = require('gulp');
const minifyCSS = require('gulp-cssnano');
const less = require('gulp-less');

function buildLess() {
  return () => {
    return gulp.src(`src/*.less`).pipe(less()).pipe(minifyCSS()).pipe(gulp.dest(`dist`));
  };
}

gulp.task('default', gulp.series(buildLess()));
