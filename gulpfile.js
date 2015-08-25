/*		
*Gulp is a build system, meaning that you can use it to automate common tasks in the development of a website. 
*It’s built on Node.js, and both the Gulp source and your Gulp file, where you define tasks, are written in JavaScript.
*
*Some are a one-off undertakings, such as enabling gzip compression, switching to an appropriate image format, or removing 
*unnecessary fonts. Other tasks require repeated effort every time you make a change. Other tasks which can be done using
*Gulp are:  compressing new or modified images,  removing console and debugger statements from scripts, concatenating and 
*minifying CSS and JavaScript files, deploying updates to a production server.
*
*For basics refer	: 	https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
*						http://www.sitepoint.com/introduction-gulp-js/?wb48617274=6116FC69 
*/ 


// include gulp
var gulp = require('gulp'); 

// Include plug-ins
var jshint	 	= require('gulp-jshint'),
	changed 	= require('gulp-changed'),
	imagemin	= require('gulp-imagemin'),
	concat 		= require('gulp-concat'),
	stripDebug 	= require('gulp-strip-debug'),
	uglify 		= require('gulp-uglify');

var spawn 		= require('child_process').spawn;
var node;
	
// JS hint task
gulp.task('jshint', function() {
  gulp.src('./public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// JS concat, strip debugging and minify and keep the minified script named as script.js
gulp.task('scripts', function() {
  gulp.src('./public/js/*.js')
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'));
});

// Minify new images and keep them in destination folder
gulp.task('imagemin', function() {
  var imgSrc = './public/images/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['index.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})



// Default gulp task
gulp.task('default', ['imagemin', 'scripts','jshint', 'server'], function() {
  
  // watch for JS changes
  gulp.watch('./public/js/*.js', function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for changes in index.js file and restart app.
  gulp.watch(['./index.js'], function() {												
    gulp.run('server');
  });
});





