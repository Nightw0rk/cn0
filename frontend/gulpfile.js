var gulp = require('gulp');
var async = require('async');
var fs = require('fs');
var path = require('path');
var mkdirp = require("mkdirp");
var cssnano = require('gulp-cssnano');
var th2 = require("through2");
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');

function replaceHost(file, enc, cb) {
    var r = new RegExp("\/\/#start_base_url_config\n(.*)\n\/\/#end_base_url_config");
    var content = String(file.contents);
    file.contents = new Buffer(content.replace("http:\/\/localhost:2080", "http://crm.lorena-kuhni.ru:2080"));
    cb(null, file);
}

function replaceBowerJs(file, enc, cb) {
    var r = new RegExp("<!-- #start bower_js-->(.+)<!-- #end bower_js-->", "g");
    var content = String(file.contents);
    var match = r.exec(content);
    if (match) {
        console.log("find bower components JS");
        var jss = new RegExp('<script.+?src="(.+?)".+?>', "g");
        var m;
        var js_files = [];
        while ((m = jss.exec(match[1])) !== null) {
            if (m.index === jss.lastIndex) {
                jss.lastIndex++;
            }
            if (m[1]) {
                js_files.push(m[1]);
            }
        }
        gulp.src(js_files)
            .on('error', console.log)
            .pipe(concat("lib.min.js"))
            .pipe(gulp.dest("build/app/assets/js"))
            .on('end', function (e, c) {
                if (e) {
                    cb(e, file);
                }
                content = content.replace(r, "<script src=\"/app/assets/js/lib.min.js\"></script>");
                file.contents = new Buffer(content);
                cb(null, file);
            });
    } else {
        cb(null, file);
    }
}

function replaceBowerCss(file, enc, cb) {
    var r = new RegExp("<!-- #start bower_css-->(.+)<!-- #end bower_css-->", "g");
    var content = String(file.contents);
    var match = r.exec(content);
    if (match) {
        console.log("find bower components CSS");
        var jss = new RegExp('<link.+?href="(.+?)".+?', "g");
        var m;
        var js_files = [];
        while ((m = jss.exec(match[1])) !== null) {
            if (m.index === jss.lastIndex) {
                jss.lastIndex++;
            }
            if (m[1]) {
                js_files.push(m[1]);
            }
        }
        gulp.src(js_files)
            .on('error', console.log)
            .pipe(cssnano())
            .pipe(concat("bower.min.css"))
            .pipe(gulp.dest("build/app/assets/styles"))
            .on('end', function (e, c) {
                if (e) {
                    cb(e, file);
                }
                content = content.replace(r, "<link rel=\"stylesheet\" href=\"/app/assets/styles/bower.min.css\" />");
                file.contents = new Buffer(content);
                cb(null, file);
            });
    } else {
        cb(null, file);
    }
}

function replaceDevelopCss(file, enc, cb) {
    var r = new RegExp("<!-- #start develop_css-->(.+)<!-- #end develop_css-->", "g");
    var content = String(file.contents);
    var match = r.exec(content);
    if (match) {                    
        var jss = new RegExp('<link.+?href="(.+?)".+?>', "g");
        var m;
        var js_files = [];
        while ((m = jss.exec(match[1])) !== null) {            
            if (m.index === jss.lastIndex) {
                jss.lastIndex++;
            }
            if (m[1]) {
                js_files.push(m[1]);
            }
        }
        console.log(js_files);
        gulp.src(js_files)
            .on('error', console.log)
            .pipe(cssnano())
            .pipe(concat("app.min.css"))
            .pipe(gulp.dest("build/app/assets/styles"))
            .on('end', function (e, c) {
                if (e) {
                    console.log('Ошибка обработки файла', file, e);
                    cb(e, file);
                }
                content = content.replace(r, "<link rel=\"stylesheet\" href=\"/app/assets/styles/app.min.css\"/>");
                file.contents = new Buffer(content);
                cb(null, file);
            });
    } else {
        cb(null, file);
    }
}


function replaceDevelopJs(file, enc, cb) {
    var r = new RegExp("<!-- #start develop_js-->(.+)<!-- #end develop_js-->", "g");
    var content = String(file.contents);
    var match = r.exec(content);
    if (match) {
        console.log("find develop components JS");
        var jss = new RegExp('<script.+?src="(.+?)".+?>', "g");
        var m;
        var js_files = [];
        while ((m = jss.exec(match[1])) !== null) {
            if (m.index === jss.lastIndex) {
                jss.lastIndex++;
            }
            if (m[1]) {
                //console.log(m[1],path.normalize(m[1]));
                js_files.push(path.normalize(m[1]));
            }
        }
        gulp.src(js_files)
            .on('error', console.log)
            .pipe(th2.obj(replaceHost))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest("build/app/assets/js"))
            .on('end', function (e, c) {
                if (e) {
                    console.log(e);
                    cb(e, file);
                }
                content = content.replace(r, "<script src=\"/app/assets/js/app.min.js\"></script>");
                file.contents = new Buffer(content);
                cb(null, file);
            });
    } else {
        cb(null, file);
    }
}

gulp.task('copy-images', function () {
    return gulp.src("app/assets/images/**")
        .pipe(gulp.dest("build/app/assets/images"))
});

gulp.task('copy-views', function () {
    return gulp.src("app/views/**/*.html")
        .pipe(gulp.dest("build/app/views"))
});

gulp.task("structure_build", function (cb) {
    async.map(
        ["build/app/assets/styles", "build/app/assets/js", "build/app/assets/images", "build/app/views"],
        mkdirp,
        function (err) {
            cb(err)
        }
    )
});

gulp.task('build', function () {
    return gulp.src("./index.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(th2.obj(replaceBowerCss))
        .pipe(th2.obj(replaceDevelopCss))
        .pipe(th2.obj(replaceBowerJs))
        .pipe(th2.obj(replaceDevelopJs))
        .pipe(gulp.dest("build"));

});

gulp.task('live', function () {
    livereload.listen({ basePath: "build", port: 35729 });
    gulp.watch('index.html').on('change', livereload.changed);
    gulp.watch('js/**/*.js').on('change', livereload.changed);
    gulp.watch('css/**/*.css').on('change', livereload.changed);
    gulp.watch('resources/**/*').on('change', livereload.changed);
    gulp.watch('views/**/*').on('change', livereload.changed);
})

gulp.task('default', ["structure_build", "copy-images", "copy-views", "build"], function () {
    return 0;
})