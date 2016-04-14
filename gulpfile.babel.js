import {src, dest, series, parallel} from 'gulp'
import rename from 'gulp-rename'
import babel  from 'gulp-babel'
import eslint from 'gulp-eslint'
import vows   from 'gulp-vows'
import del    from 'del'

const tasks = {

  lintLib: () =>
    src('index.es')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ,

  lintTest: () =>
    src('test.es')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ,

  buildLib: () =>
    src('index.es')
    .pipe(babel())
    .pipe(rename(path => path.extname = '.js'))
    .pipe(dest('.'))
  ,

  buildTest: () =>
    src('test.es')
    .pipe(babel())
    .pipe(rename(path => path.extname = '.js'))
    .pipe(dest('.'))
  ,

  test: () => src('test.js').pipe(vows({reporter: 'spec'})),

  clean: () => del(['index.js', 'test.js']),

}

export const build = series(
  parallel(
    series(
      tasks.lintLib,
      tasks.buildLib,
    ),
    series(
      tasks.lintTest,
      tasks.buildTest,
    ),
  ),
  tasks.test,
)

export const test = series(
  build,
  tasks.clean,
)

export const clean = tasks.clean

export default test
