const { dest, src, task, watch } = require('gulp');
const { createProject } = require('gulp-typescript');

const tsconf = createProject('tsconfig.json');

/**
 * @param {String} dir 
 */
const copy = (dir) => {
    return src([`${dir}/**/*`]).pipe(dest(dir.replace('src', 'dist')));
};

const build = () => {
    return src('src/**/*.ts').pipe(tsconf()).js.pipe(dest('dist'));
};

task('build', () => {
    copy('src/static');
    copy('src/app/Views');
    return build();
});

task('copy', () => {
    copy('src/static');
    return copy('src/app/Views');
});

task('default', () => {
    let space = String();

    for (let _ = 0; _ < process.stdout.columns; _++) {
        space += "-";
    }

    console.log(space);
    console.error("No default task has been created");
    console.log(space);
});

task('watch', () => {
    return watch(['src/static/**/*', 'src/app/Views/**/*'], () => {
        copy('src/static');
        return copy('src/app/Views');
    });
});