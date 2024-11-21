# 原生微信小程序中 TypeScript 构建流程的搭建

> 技术栈：`node` + `gulp`

### 一、背景与现状

1. 目前项目基于原生小程序开发，不出意外，以后也会是这样。原生小程序已支持部分 `ES6` 语法，所以，还是能提升部分开发效率的。
2. 之前呢，团队开发多个产品，团队成员每人负责一到两个产品，对自己写的代码各自都是比较熟悉的，所以对协作要求不是很高，现有的开发流程是基本满足的。
3. 现在团队开发一个产品，涉及到多人协作，比如一个基础方法修改的时候，怎么能及时同步给调用方？为了更好的团队协作和保证代码质量，所以基于 `typescript` 开发就势在必行了。

### 二、ts 构建支持

#### 1. 依赖包安装

```bash
npm install -D typescript gulp-typescript @typescript-eslint/parser miniprogram-api-typings
```

#### 2. tsconfig.json 配置文件

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "esModuleInterop": true,
        "declaration": true,
        "noImplicitAny": false,
        "outDir": "dist",
        "baseUrl": ".",
        "allowJs": true, // 允许JS文件，兼容老项目
        "checkJs": false, // 不检查JS文件，兼容老项目
        "types": ["miniprogram-api-typings"], // 小程序类型定义引入
        "paths": {
            "@/*": ["./src/*"] // 设置路径别名
        },
        "skipLibCheck": true
    },
    "include": ["src/**/*.ts"]
}
```

#### 3. ts 构建实现

```json
// package.json

{
    "scripts": {
        "ts:build:src": "gulp -f build/compiler.js --series buildSrc"
    }
}
```

```javascript
// build/compiler.js

const path = require('node:path');
const gulp = require('gulp');
const typescript = require('gulp-typescript');

const srcDir = path.resolve(__dirname, '../src');
const tsConfig = path.resolve(__dirname, '../tsconfig.json');
const distDir = path.resolve(__dirname, '../dist');

/**
 * ts 构建
 */
function gulpTsCompiler(dist, tsConfig, srcList = [`${srcDir}/**/*.ts`]) {
    return function compileTs() {
        const project = typescript.createProject(tsConfig);
        const compiled = gulp.src(srcList).pipe(project());
        return compiled.js.pipe(gulp.dest(dist));
    };
}

/**
 * 构建任务
 */
const tasks = [['buildSrc', distDir, tsConfig]].reduce((prev, [name, ...args]) => {
    prev[name] = gulp.series(gulpTsCompiler(...args));
    return prev;
}, {});

module.exports = tasks;
```

> 到这里，就可以用 `ts` 开发了。但实际 `coding` 中，我们发现有以下痛点：
>
> 1. `ts 文件`中引入路径的时候，希望通过`@别名`引入，这样就可以愉快的复制粘贴了。
> 2. 原生小程序文件支持 es6 异步语法 async 和 await 需要先引入`import regeneratorRuntime from '../../libs/runtime';`，动态自动引入多好！

所以就特别实现下。

### 三、ts 构建优化

```javascript
// build/compiler.js

const Buffer = require('node:buffer').Buffer;
const tap = require('gulp-tap');

/**
 * ts文件内容处理
 */
function tsFileHandler({ file }) {
    const filePath = path.dirname(file.path);
    const fileBase = file.base;
    let relativePath = path.relative(filePath, fileBase);
    let fileContents = String(file.contents);

    /**
     * 为了保持代码风格统一，这里仅支持`@别名`
     * 为了保证`@别名`和`npm包的别名`冲突，这里用`@/`做下区分
     */
    if (fileContents.includes('@/')) {
        fileContents = fileContents.replace(/(import\s+.+\s+from\s+['|"])(@)(\/.+)(['|"])/g, ($1, $2, $3, $4, $5) => {
            switch ($3) {
                case '@':
                    break;
                default:
                    // 这里留个彩蛋，但后面功能扩展
                    relativePath = $3;
                    break;
            }
            return `${$2}${relativePath || '.'}${$4}${$5}`;
        });
    }

    /**
     * 支持 ts 文件自动引入 async/await  支持，如：
     * import regeneratorRuntime from '../../libs/runtime';
     */
    if (fileContents.includes('async') && !fileContents.includes('regeneratorRuntime')) {
        fileContents = `import regeneratorRuntime from '${relativePath}/libs/runtime';\n${fileContents}`;
    }

    return Buffer.from(fileContents);
}

/**
 * 支持 ts 文件通过路径路径别名引入方式
 */
function gulpTsCompiler(dist, tsConfig, srcList = [`${srcDir}/**/*.ts`]) {
    return function compileTs() {
        const project = typescript.createProject(tsConfig);
        const compiled = gulp.src(srcList).pipe(project());
        return compiled.js
            .pipe(gulp.dest(dist))
            .pipe(
                tap((file) => {
                    file.contents = tsFileHandler({ file });
                })
            )
            .pipe(gulp.dest(dist));
    };
}
```

> 到这里，ts 文件的构建支持算是暂时告一段落了。不过既然用了构建，牺牲了小程序开发者工具的构建效率，那何不更进一步，支持下 `sass` 书写 `wxss` 文件呢？来吧，说干就干！

### 四、sass 支持

#### 1. 安装依赖

```bash
npm install -D gulp-sass
```

#### 2. 具体实现

首先更新我们的 ts 构建任务：

```javascript
// build/compiler.js

const tasks = [['buildSrc', distDir, tsConfig]].reduce((prev, [name, ...args]) => {
    prev[name] = gulp.series(gulpTsCompiler(...args), sassCompiler(...args));
    return prev;
}, {});
```

然后实现 sassCompiler 功能：

```javascript
// build/compiler.js

const sass = require('gulp-sass');

function sassCompiler(dist) {
    return function compileSass() {
        return gulp
            .src(`${srcDir}/**/*.scss`)
            .pipe(
                rename({
                    extname: '.wxss',
                })
            )
            .pipe(gulp.dest(dist));
    };
}
```

> 到这里，试下新建`test.scss`文件，果然生成`test.wxss`文件。可是，新问题来了，scss 文件`@import`语法支持不太完美。

**问题描述：**

`a.scss`被`b.scss`文件和`c.scss`文件引用，构建结果里面，b.wxss 和 c.wxss 文件里面都有 a.scss 的文件内容，这样就不符预期了，因为

1. 会增大构建后的文件的大小，进而也会增大包的大小，与小程序包大小有限制的策略背道而驰。
2. 原生小程序`wxss文件`支持`@import`语法，没必要编译，进而增加系统复杂度。

**解决方案探索**

`scss 文件`编译为 `wxss 文件`之前，先把`@import 行代码`注释掉，生成 `wxss 文件后再取消注释，就解决了此场景。

> 但这样，又引入了新问题，因为`scss 文件`引入`变量文件`后，需要用到`变量文件`里面的`变量定义`，如果注释掉，那么变量就无法被解析了。

所以，需要兼容下变量文件的场景，为了代码规范的统一，我们只限定两种变量文件的名称，另外也增加了代码的可读性。

**完整代码实现如下：**

```javascript
// build/compiler.js

const Buffer = require('node:buffer').Buffer;

/**
 * 存放 variable 和 mixin 的scss文件在被引用时直接导入，如：
 * @import 'variable.scss';
 * @import 'mixin.scss';
 */
const SASS_DIRECT_IMPORT = ['variable', 'mixin'];

function sassCompiler(dist) {
    return function compileSass() {
        return (
            gulp
                .src(`${srcDir}/**/*.scss`)
            /**
             * 开始处理 import
             * `@import`语法忽略解析
             */
                .pipe(
                    tap((file) => {
                        const filePath = path.dirname(file.path);
                        file.contents = Buffer.from(
                            String(file.contents).replace(/@import\s+['|"](.+)['|"];/g, ($1, $2) => {
                                const imPath = path.resolve(`${filePath}/${$2}`);
                                return SASS_DIRECT_IMPORT.some((item) => {
                                    return imPath.includes(item);
                                })
                                    ? $1
                                    : `/** ${$1} **/`;
                            })
                        );
                    })
                )
                .pipe(sass().on('error', sass.logError))
            /**
             * 结束处理 import
             * `@import`语法忽略解析
             */
                .pipe(replace(/(\/\*\*\s*)(@.+)(\s*\*\*\/)/g, ($1, $2, $3) => $3.replace(/\.scss/g, '.wxss')))
                .pipe(rename({ extname: '.wxss' }))
                .pipe(gulp.dest(dist))
        );
    };
}
```

> 到这里，发现 `ts` 和 `scss` 文件构建都正常了，但打开构建目 `dist` 后发现，咦，其他文件怎么不见了？其实不见是正常的，因为毕竟还没有对静态资源进程处理。所以这里增加下静态资源的 `copy`。

### 五、静态资源处理

```javascript
// build/compiler.js

function copier(dist, ext, src = '') {
    return function copy() {
        src = src || srcDir;
        return gulp.src(`${src}/**/*.${ext}`).pipe(gulp.dest(dist));
    };
}

/**
 * 这里用`gulp.parallel`而不是`gulp.series`，因为静态资源是可以并行处理的，增加构建速度
 */

function staticCopier(dist) {
    return gulp.parallel(copier(dist, '{js,wxml,wxss,wxs,json}'), copier(`${dist}/assets`, '*', `${srcDir}/assets`));
}

const tasks = [['buildSrc', distDir, tsConfig]].reduce((prev, [name, ...args]) => {
    prev[name] = gulp.series(gulpTsCompiler(...args), sassCompiler(...args), staticCopier(...args));
    return prev;
}, {});
```

> 用微信开发者工具打开目标目录`dist`发现可以正常工作。可是，重新构建的时候，为了避免老的代码对新的代码造成影响，所以这里需要先做下清理处理。

### 六、清理构建目录

1. 安装依赖

```bash
npm install -D del
```

2. 功能实现

```json
// package.json

{
    "scripts": {
        "ts:build:src": "gulp clear-dist && gulp -f build/compiler.js --series buildSrc"
    }
}
```

```javascript
// gulpfile.babel.js

import del from 'del';

gulp.task('clear-dist', () => {
    return del([`${distDir}/**`]);
});
```

> 到这里，原生小程序代码构建为目标代码，基本算是处理完毕了。可是，新问题来了。我们实际开发中，构建出初始化目标代码，预览小程序只是开始，而不是终止。因为我们还需要做改动看效果，所以就得监听文件改动，实现实时预览了。

### 七、监听文件改动，实时预览

**实现方案梳理**

1. 对于静态资源，监听改动后，直接 copy 到目标目录
2. 对于 ts 文件，监听改动后，进行 ts 构建处理
3. 对于 sass 文件，监听改动后，进行 sass 构建处理
4. gulp 4 版本后，支持增加文件监听，所以这样我们就可以监听文件改动后，进行增量处理了。

**具体实现**

```json
// package.json

{
    "scripts": {
        "ts:watch:src": "gulp -f build/compiler.js --series srcWatch"
    }
}
```

这里以 `ts` 构建监听为例，其他实现类似，就不再一一列举了。

```javascript
// build/compiler.js

function watchTsHandler() {
    const project = typescript.createProject(tsConfig);
    const compiled = gulp
        .src([`${srcDir}/**/*.ts`], {
            // 区别在这里，增加监听的配置项，监听处理函数为自身
            since: gulp.lastRun(watchTsHandler),
        })
        .pipe(project());

    return compiled.js
        .pipe(
            tap((file) => {
                file.contents = tsFileHandler({ file });
            })
        )
        .pipe(gulp.dest(distDir));
}

tasks.srcWatch = gulp.series(() => {
    gulp.watch(`${srcDir}/**/*.ts`, watchTsHandler);
});
```
