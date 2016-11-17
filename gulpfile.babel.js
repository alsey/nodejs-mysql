import gulp from 'gulp'
import babel from 'gulp-babel'
import mocha from 'gulp-mocha'

gulp.task('build', () => {
  return gulp.src('src/**/*')
             .pipe(babel({ highlightCode: false }))
             .pipe(gulp.dest('lib'))
})

gulp.task('test', ['build'], () => {
  return gulp.src('./test/*.spec.js', { read: false })
             .pipe(mocha({ reporter: 'nyan' }))
})

gulp.task('default', ['build'])