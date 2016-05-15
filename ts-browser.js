import gulp from "gulp";
import gulpIf from "gulp-if";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";
import saveLicense from "uglify-save-license";
import named from "vinyl-named";

export async function buildBrowser(config, release, watch) {
    let webpackConfig = {
        entry: ["babel-polyfill"],
        resolve: { extensions: ["", ".ts", ".tsx", ".js"] },
        module: {
            loaders: [{ loader: "babel-loader?presets[]=es2015!ts-loader" }]
        },
        devtool: release ? null : "eval-cheap-module-source-map",
        externals: {
            "babel-polyfill": "babel-polyfill"
        },
        watch
    };

    return gulp.src(config.src)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulpIf(release, uglify({ preserveComments: saveLicense })))
        .pipe(gulp.dest(config.dest));
}
