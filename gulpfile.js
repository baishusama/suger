var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); // 需要实例化
var open = require('open');

// 路径
var app = {
  srcPath: 'src/',
  devPath: 'build/',
  prdPath: 'dist/'
};

// 到 dist 正式环境需要做替换
var replace = require('gulp-replace');
// var deleteFile = require('gulp-delete-file');
var filter = require('gulp-filter');

// 需要放置到开发和生产环境目录下的有：

// 一些第三方依赖
gulp.task('lib', function() {
  gulp.src('bower_components/**/*.js') // '**/*' 对子文件进深度遍历同时读取所有文件
    .pipe(gulp.dest(app.devPath + 'vendor'))
    .pipe(gulp.dest(app.prdPath + 'vendor'))
    .pipe($.connect.reload()); // 通知服务器刷新页面
});

// html 源码
gulp.task('html', function() {
  gulp.src(app.srcPath + '**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
});

// css
gulp.task('less', function() {
  gulp.src(app.srcPath + 'style/index.less')
    // 编译 & 拷贝到开发环境
    .pipe($.less()) // gulp-less
    .pipe(gulp.dest(app.devPath + 'public/css'))
    // 压缩编译好的 css & 拷贝到生产环境中
    .pipe($.cssmin())
    .pipe(gulp.dest(app.prdPath + 'public/css'))
    .pipe($.connect.reload());
});

// // php
// gulp.task('php', function() {
//   gulp.src(app.srcPath + 'api/**/*.php')
//     .pipe(gulp.dest(app.devPath + 'api'))
//     .pipe(replace('DatabaseDevOnly.class.php', 'Database.class.php'))
//     .pipe(replace('localhost/blog/build', 'baishu.applinzi.com/blog'))
//     .pipe(gulp.dest(app.prdPath + 'api'))
//     .pipe($.connect.reload());
// });

// 开发环境的 php
gulp.task('phpBuild', function() {
  gulp.src(app.srcPath + 'api/**/*.php')
    // 开发环境不需要正式环境相关的文件
    .pipe(filter(['**', '!**/article/delete.php', '!**/image/upload.php', '!**/config/Database.class.php', '!**/*Sample*.php']))
    .pipe(gulp.dest(app.devPath + 'api'))
    .pipe($.connect.reload());
});

// 正式环境的 php
gulp.task('phpDist', function() {
  gulp.src(app.srcPath + 'api/**/*.php')
    // 正式环境不需要 devOnly 相关的文件
    .pipe(filter(['**', '!**/*DevOnly*.php', '!**/*Sample*.php']))
    // 正式环境需要连接 SAE 的数据库
    .pipe(replace('DatabaseDevOnly.class.php', 'Database.class.php'))
    // 正式环境需要全局替换 url
    .pipe(replace('localhost/blog/build', 'baishu.applinzi.com/blog'))
    .pipe(gulp.dest(app.prdPath + 'api'))
    .pipe($.connect.reload());
});

// js
gulp.task('js', function() {
  gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.concat('index.js')) // 合并为一个 js 文件
    // 开发环境：
    .pipe(gulp.dest(app.devPath + 'js'))
    // 正式环境：
    // 正式环境不需要 devOnly 相关的文件
    .pipe(replace('uploadDevOnly.php', 'upload.php'))
    .pipe(replace('deleteDevOnly.php', 'delete.php'))
    // 正式环境全局替换 url
    .pipe(replace('localhost/blog/build', 'baishu.applinzi.com/blog'))
    // 正式环境全局删除 console.log();
    .pipe(replace(/[,]?console\.log\(.+?\)[,;]?/g, ''))
    .pipe($.uglify()) // 压缩
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

// image
gulp.task('image', function() {
  gulp.src(app.srcPath + 'image/**/*') // png,jpg,gif
    .pipe(gulp.dest(app.devPath + 'public/image'))
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath + 'public/image'))
    .pipe($.connect.reload());
});

// // 清除非特定环境下文件
// gulp.task('delPrdOnlyfile', ['php'], function() {
//   var re = /^$|^$|^$/;
//   gulp.src([
//     'build/api/**/*.php'
//   ]).pipe(deleteFile({
//     reg: re,
//     deleteMatch: true
//   }));
// });
//
// gulp.task('delDevOnlyfile', ['php'], function() {
//   var re = /.+DevOnly.+$/;
//   gulp.src([
//     'dist/api/**/*.php'
//   ]).pipe(deleteFile({
//     reg: re,
//     deleteMatch: true
//   }));
// });

// 总任务 - 用于打包
// gulp.task('build', ['lib', 'html', 'php', 'js', 'less', 'image', 'delPrdOnlyfile', 'delDevOnlyfile']); // 总任务
// gulp.task('build', ['lib', 'html', 'php', 'js', 'less', 'image']); // 总任务
gulp.task('build', ['lib', 'html', 'phpBuild', 'phpDist', 'js', 'less', 'image']); // 总任务

// 清除旧文件
gulp.task('clean', function() {
  gulp.src([app.devPath, app.prdPath])
    .pipe($.clean());
});

// 启动服务器以查看页面
gulp.task('serve', ['build'], function() {
  $.connect.server({
    root: [app.devPath],
    livereload: true,
    port: 1234
  });
  // 其中，livereload 属性是自动刷新，只针对高级浏览器（IE 不支持）

  open('http://localhost:1234');

  // 使在修改源文件的时候自动执行构建任务
  gulp.watch('bower_components/**/*.js', ['lib']);
  gulp.watch(app.srcPath + '**/*.html', ['html']);
  gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
  gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
  gulp.watch(app.srcPath + 'image/**/*', ['image']);
  // gulp.watch(app.srcPath + 'api/**/*.php', ['php']);
  gulp.watch(app.srcPath + 'api/**/*.php', ['phpBuild', 'phpDist']);
});

// 偷懒简写 gulp
gulp.task('default', ['serve']);

// // 合并两步（重启）
// gulp.task('restart', ['clean', 'serve']);
