var gulp = require('gulp');
var sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "http://192.168.99.24:9000",
    options : {
    }
  }, callback);
});