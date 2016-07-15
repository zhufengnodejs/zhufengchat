var gulp = require('gulp');
var del = require('del');
//插件名称和对象key值相同，可以通过$获取插件引用
var $ = require('gulp-load-plugins')();

//删除文件夹
gulp.task('clean', del.bind(null, ['dist']));

gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: ['app','public']});
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('extra', function () {
    return gulp.src(['app/**/*.html','!app/index.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['html','extra'], function () {
    //打包后 统计文件体积并输出到目标目录 gzip展示压缩后的大小
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});