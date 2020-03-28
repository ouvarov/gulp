const gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    merge = require('merge-stream'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    ghPages = require('gulp-gh-pages'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyHTML = require('gulp-minify-html'),
    spritesmith = require('gulp.spritesmith'),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    babel = require('gulp-babel'),
    jsImport = require('gulp-js-import'),
    svgSprite = require('gulp-svg-sprite'),
    eslint = require('gulp-eslint'),
    minify = require('gulp-minify');


// start the server
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

// import js
gulp.task('import', function() {
    return gulp.src('scripts/index.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'));
});

// babel
gulp.task('babel',function() {
    return gulp.src('./js/**/index.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('js'))
});

//stylelint
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

// fix-csslint
gulp.task('fix-css', function fixCssTask() {
    const gulpStylelint = require('gulp-stylelint');

    return gulp
        .src(['./sass/**/*.scss', './sass/**/*.sass'])
        .pipe(gulpStylelint({
            fix: true
        }))
        .pipe(gulp.dest('sass'));
});

//eslint
gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['./scripts/**.js'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());
});

// compiling sass / scss into css
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

// build a page from templates
gulp.task('fileinclude', function() {
    gulp.src('./pages/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }).on('error', gutil.log))
        .on('error', notify.onError())
        .pipe(gulp.dest('./'))
});

// compression svg, png, jpeg
gulp.task('minify:img', function() {
    //we take all the pictures except the folder where the pictures are for the sprite
    return gulp.src(['./images/**/*', '!./images/sprite/*'])
        .pipe(imagemin().on('error', gutil.log))
        .pipe(gulp.dest('./public/images/'));
});

// compression css
gulp.task('minify:css', function() {
    gulp.src('./css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('./public/css/'));
});

// compression js
gulp.task('minify:js', function() {
    gulp.src('./js/**/index.js')
      .pipe(minify({
        ext:{
          min:'.js'
        },
        noSource: true
      }))
        .pipe(gulp.dest('./public/js/'))
});

// compression html
gulp.task('minify:html', function() {
    var opts = {
        conditionals: true,
        spare: true
    };

    return gulp.src(['./*.html'])
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./public/'));
});

// delete folder public
gulp.task('clean', function() {
    return gulp.src('./public', { read: false }).pipe(clean());
});

// create a picture sprite from the images / sprite folder
gulp.task('sprite', function() {
    var spriteData = gulp.src('images/sprite/*.png').pipe(
        spritesmith({
            imgName: 'sprite.png',
            cssName: '_icon-mixin.scss',
            retinaImgName: 'sprite@2x.png',
            retinaSrcFilter: ['images/sprite/*@2x.png'],
            cssVarMap: function(sprite) {
                sprite.name = 'icon-' + sprite.name;
            }
        })
    );
    var imgStream = spriteData.img.pipe(gulp.dest('images/'));
    var cssStream = spriteData.css.pipe(gulp.dest('sass/'));

    return merge(imgStream, cssStream);
});

//svg spite
gulp.task('svgSprite', function () {
    return gulp.src('images/sprite_src/*.svg') // svg files for sprite
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "sprite.svg"  //sprite file name
                    }
                }
            }
        ))
        .pipe(gulp.dest('images/sprite_src'));
});

// publication on gh-pages
gulp.task('deploy', function() {
    return gulp.src('./public/**/*').pipe(ghPages());
});

// when called in the gulp command terminal, tasks will be started
// server - to start the server,
// sass - to compile sass into css because the browser
// does not understand the previous syntax,
// fileinclude - to assemble a full page from small templates
gulp.task('default', ['server','import','babel','sass','fileinclude','lint']);

// when calling the gulp production command
// all resources will be compressed into the public folder
// then the gulp deploy command can publish them to github
gulp.task('production', ['minify:html', 'minify:css', 'minify:js', 'minify:img']);
//test scss npx stylelint "**/*.scss"
