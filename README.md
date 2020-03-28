# gulp-build

**Instal**

    npm i
 
**Run server**

    gulp
    
   server watch on scripts/**.js,sass/**.scss/.sass,templates/**.html use eslint stylelint buble
    
**Include Js file**

    gulp import
    
   All files are in folder scripts and include in file index.js. Include build all file in folder js/index.js. Сan be connected in mode_modules files
    
**Include sass/scss**

    gulp sass
  
   All files are in folder sass include in style.scss/sass and have prefix _file.scss/sass. If need fix stylelint use gulp fix-css. include folder css/style.css
    
**Include html**

    gulp fileinclude
    
   All files are in folder templates. Includes in folder pages/**.index, use prefix '@@" @@include('../templates/**.html') first file should be index.html
    
   use https://www.npmjs.com/package/gulp-file-include#api

**Images**

   All images should be folder images
    
    gulp minify:img
    
   compresses file in images/**/*
   
**Make public project**

    gulp production
    
   Make folder public it delimits files compressed for the project use gulp minify:html, minify:css, minify:js, minify:img
    
**Publication on gh-pages**

    gulp deploy
