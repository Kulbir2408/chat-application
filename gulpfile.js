var gulp		=	require('gulp');
var	browserSync	= require('browser-sync') ;
var spawn = require('child_process').spawn;
var node;
var reload = browserSync.reload;

gulp.task('default',function(){
	gulp.run('server');

  gulp.watch(['./index.js'], function() {												//'./lib/**/*.js'
    gulp.run('server');
  });

});

gulp.task('restartApp',function(){
	
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