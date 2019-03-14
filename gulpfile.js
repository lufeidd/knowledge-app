//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    sass = require('gulp-sass');

//定义一个 testSass 任务（自定义任务名称）
gulp.task('testSass', done => {
    gulp.src('src/style/scss/*.scss') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(gulp.dest('src/style/css')); //将会在src/css下生成index.css
    done();
});

// gulp.task('default', ['testSass']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径

// gulp.task('HelloWorld', function() { 
//     console.log('HelloWorld');
// });