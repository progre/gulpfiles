import fs from "fs";
import gulp from "gulp";
import gulpIf from "gulp-if";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";
import saveLicense from "uglify-save-license";
import named from "vinyl-named";

export async function buildMain(config, release, watch) {
    let nodeModules = {};
    fs.readdirSync("node_modules")
        .filter(x => [".bin"].indexOf(x) === -1)
        .forEach(mod => {
            nodeModules[mod] = "commonjs " + mod;
        });

    let webpackConfig = {
        resolve: { extensions: ["", ".ts", ".tsx"] },
        module: {
            loaders: [{
                loader: "babel-loader?presets[]=modern-node/6.0&presets[]=stage-3!ts-loader"
            }]
        },
        externals: nodeModules,
        devtool: release ? null : "inline-source-map",
        watch
    };

    return gulp.src(config.src)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(config.dest));
}
