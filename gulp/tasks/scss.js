import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Сжатие СSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, {sourcemaps: true})
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(groupCssMediaQueries())
    .pipe(webpcss({
        webpClass: ".webp",
        noWebpClass: ".nowebp"
    }))
    .pipe(autoprefixer({
        grid: true,
        overrideBrowserList: ["last 3 versions"],
        cascade: true
    }))
    
    //Раскомментировать, если нужен не сжатый файл стилей
    .pipe(app.gulp.dest(app.path.build.css))

    .pipe(cleanCss())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream())  
}