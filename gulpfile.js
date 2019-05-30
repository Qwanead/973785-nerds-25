var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var imagemin = require("gulp-imagemin");
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
var ghPages = require('gh-pages');
var path = require('path');

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}
exports.deploy = deploy;

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("./css"))
    .pipe(csso())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("./css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("./"));
  });

gulp.task("js", function () {
  return pipeline(
    gulp.src("source/js/*.js"),
    gulp.dest("./js/"),
    uglify(),
    rename({suffix: ".min"}),
    gulp.dest("./js")
  );
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico",
    "source/css/README",
    "source/js/README"
  ], {
    base: "source/"
  })
    .pipe(gulp.dest("./"));
});

gulp.task("clean", function () {
  return del(["./img", "./*.html", "./js", "./css"]);
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  // .pipe(imagemin([
  //   imagemin.optipng({optimizationLevel: 3}),
  //   imagemin.jpegtran({progressive: true}),
  //   imagemin.svgo()
  // ]))
  .pipe(gulp.dest("./img"));
});

gulp.task('server', function() {
  server.init({
    server: "./",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js").on("change", gulp.series("js", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "images",
  "html",
  "css",
  "js"
));

gulp.task("start", gulp.series("build", "server"));
