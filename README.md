# gulp-build

**Instal**

    npm сi
 
**Run server**

    gulp
    
   server watch on scripts/**.js,sass/**.scss/.sass,templates/**.html use eslint stylelint buble
   
```php
   gulp.task('server', function() {
        browserSync.init({
            server: {
                baseDir: "./"
            },
            port: "7777"
        });
        gulp.watch(['./**/*.html']).on('change', browserSync.reload);
        gulp.watch('./js/**/*.js').on('change', browserSync.reload);
        gulp.watch('./scripts/**/*.js').on('change', browserSync.reload);
        gulp.watch([
            './templates/**/*.html',
            './pages/**/*.html'
        ], ['fileinclude']);
        gulp.watch([
            './scripts/**/*.js',
            './js/**/*.js'
        ], ['babel']);
        gulp.watch([
            './scripts/**/*.js'
        ], ['lint']);
        gulp.watch(['./sass/**/*'], ['lint-css']);
        gulp.watch('./sass/**/*', ['sass']);
        gulp.watch('./scripts/**/*', ['import']);
    });
 ```
    
**Include Js file**

    gulp import
    
   All files are in folder scripts and include in file index.js. Include build all file in folder js/index.js. Сan be connected in mode_modules files
   
```php
gulp.task('import', function() {
         return gulp.src('scripts/index.js')
             .pipe(jsImport({hideConsole: true}))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('js'));
     });
  ```
    
    
**Include sass/scss**

    gulp sass
  
   All files are in folder sass include in style.scss/sass and have prefix _file.scss/sass. include folder css/style.css
   
   ```php
   gulp.task('sass', function() {
        gulp.src(['./sass/**/*.scss', './sass/**/*.sass'])
            .pipe(sourcemaps.init())
            .pipe(
                sass({ outputStyle: 'expanded' })
                    .on('error', gutil.log)
            )
            .on('error', notify.onError())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./css/'))
            .pipe(browserSync.stream());
    });
 ```
    
**Stylelint**
    
    gulp lint-css
    
   Нou can customize the code style in the file .stylelintrc
   
   ```php
   gulp.task('lint-css', function lintCssTask() {
        const gulpStylelint = require('gulp-stylelint');
        return gulp
            .src(['./sass/**/*.scss', './sass/**/*.sass'])
            .pipe(gulpStylelint({
                reporters: [
                    {formatter: 'string', console: true}
                ]
            }));
    });
```

**Fix stylelint**

    gulp fix-css
    
   Use this command for fix code style scss/sass
   
   ```php
   gulp.task('fix-css', function fixCssTask() {
        const gulpStylelint = require('gulp-stylelint');
        return gulp
            .src(['./sass/**/*.scss', './sass/**/*.sass'])
            .pipe(gulpStylelint({
                fix: true
            }))
            .pipe(gulp.dest('sass'));
    });
 ```
    
**eslint**

    gulp lint
    
   Нou can customize the code style in the file .eslintrc and add ignore file in .eslintignore
   
   ```php
   gulp.task('lint', function () {
        return gulp.src(['./scripts/**.js'])
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(eslint.failAfterError());
    });
 ```
    
**Babel**

    gulp babel
    
   Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments.
   
   ```php
   gulp.task('babel',function() {
        return gulp.src('./js/**/index.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulp.dest('js'))
    });
```
    
    
**Include html**

    gulp fileinclude
    
   All files are in folder templates. Includes in folder pages/**.index, use prefix '@@" @@include('../templates/**.html') first file should be index.html
   
   ```php
   gulp.task('fileinclude', function() {
        gulp.src('./pages/**/*.html')
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }).on('error', gutil.log))
            .on('error', notify.onError())
            .pipe(gulp.dest('./'))
    });
  ```
    
   use https://www.npmjs.com/package/gulp-file-include#api

**Images**

   All images should be folder images
    
    gulp minify:img
    
   ```php
   gulp.task('minify:img', function() {
         //we take all the pictures except the folder where the pictures are for the sprite
         return gulp.src(['./images/**/*', '!./images/sprite/*'])
             .pipe(imagemin().on('error', gutil.log))
             .pipe(gulp.dest('./public/images/'));
     });
   ```
    
   compresses file in images/**/*
   
**Make public project**

    gulp production
    
   Make folder public it delimits files compressed for the project use gulp minify:html, minify:css, minify:js, minify:img
   

   ```php
   gulp.task('production', ['minify:html', 'minify:css', 'minify:js', 'minify:img']);
   
   ```
    
**Publication on gh-pages**

    gulp deploy
