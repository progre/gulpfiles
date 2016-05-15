import gulp from "gulp";
import typings from "gulp-typings";
import {parallel} from "./util.js";
import * as tslint from "./tslint.js";
import {buildMain} from "./ts-main.js";
import {buildBrowser} from "./ts-browser.js";

export const lint = tslint;
export let config = {
    main: {
        src: ["src/**/*.ts", "!src/test/**", "!src/public/js/**"],
        dest: "lib/"
    },
    browser: {
        src: ["src/public/js/app.ts"],
        dest: "lib/public/js/"
    }
};

gulp.task("ts:typings", () => {
    return gulp.src("typings.json")
        .pipe(typings());
});
gulp.task("ts:watch", build(false, true));
gulp.task("ts:debug", build(false, false));
gulp.task("ts:release", build(true, false));

function build(release, watch) {
    return gulp.series(
        "ts:typings",
        gulp.parallel(
            "tslint:tslint",
            function ts_build() {
                let tasks = [];
                if (config.main != null) {
                    tasks.push(buildMain(config.main, release, watch));
                }
                if (config.browser != null) {
                    tasks.push(buildBrowser(config.browser, release, watch));
                }
                return parallel(tasks);
            }
        )
    )
}
