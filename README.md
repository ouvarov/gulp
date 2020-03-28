# gulp-build

**Instal**

    npm i
 
**Run server**
    gulp
    
   _server watch on scripts/**.js,sass/**.scss/.sass,templates/**.html use eslint stylelint buble_
    
**Include Js file**
    All files are in folder scripts and include in file index.js. Include build all file in folder js/index.js. Сan be connected in mode_modules files
    
**Include sass/scss**
  
   All files are in folder sass include in style.scss/sass and have prefix _file.scss/sass. If need fix stylelint use gulp fix-css. include folder css/style.css
    
**Include html**
    
   All files are in folder templates. Includes in folder pages/**.index first file should be index.html
    
**Make public project**

   gulp production. Make folder public it delimits files compressed for the project
    
**Publication on gh-pages**
    gulp deploy
