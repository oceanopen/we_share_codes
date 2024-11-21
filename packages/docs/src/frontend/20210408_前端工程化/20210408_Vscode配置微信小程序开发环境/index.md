## Vscode 配置微信小程序开发环境

### 一、安装依赖

```bash
npm install eslint eslint-config-prettier eslint-plugin-prettier prettier
```

### 二、初始化配置

> 代码规范: `.eslintrc.js`

```javascript
module.exports = {
    env: {
    // 脚本目标的运行环境
        browser: true,
        node: true,
        es6: true,
        commonjs: true,
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    extends: ['prettier', 'prettier/standard'],
    // 插件
    plugins: ['prettier'],
    // 规则
    rules: {
        'prettier/prettier': 'error',
    },
};
```

> IDE: `.editorconfig`

```bash
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
```

> 自动格式化: `.prettierrc.js`

```javascript
module.exports = {
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    printWidth: 120,
};
```

> 忽略文件: `.eslintignore`

```
node_modules/

src/**/*.wxml
src/assets/
src/libs/
src/node_modules/
src/miniprogram_npm/

dist
app
```

### 三、小程序全局变量配置

```javascript
// .eslintrc.js

module.exports = {
    // 全局变量
    globals: {
        App: true,
        Page: true,
        Component: true,
        Behavior: true,
        wx: true,
        getApp: true,
        getRegExp: true,
        getCurrentPages: true,
        requirePlugin: true,
    },
};
```

### 四、ts 支持

```javascript
module.exports = {
    parser: '@typescript-eslint/parser',
};
```

### 五、自定义规则

```javascript
module.exports = {
    // 规则
    rules: {
    // 拖尾逗号
        'comma-dangle': ['error', 'only-multiline'],
        // 注释后面自动加空格
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: ['/'],
                    exceptions: ['-', '+', '='],
                },
                block: {
                    markers: ['!'],
                    exceptions: ['*', '='],
                    balanced: true,
                },
            },
        ],
    },
};
```

### 六、格式化脚本

```json
// package.json
{
    "scripts": {
        "lint": "eslint -c .eslintrc.js ./src --fix"
    }
}
```

> 到这里，代码格式化配置基本实现了。但每次修改完后，去执行格式化脚本，总有些不便，那么接下来就配置 `vscode` 实现保存自动格式化

### 七、vscode 配置

#### 安装插件

> 以下为项目初始化必须要安装的扩展，若有冲突的扩展项，请先卸载掉或者去掉全局配置

**格式化相关**

1. `ESLint` #JS 及 CSS 文件格式化
2. `Pretier - Code formatter` #JSON 文件格式化
3. `vscode-wxml` #提供 wxml 语法支持

**优化开发体验相关**

4. `Git History`
5. `Git History Diff`
6. `vscode-icons` #文件显示图标，开发体验优化用到
7. `wxml` #微信小程序 wxml 格式化
8. `TODO Highlight` #TODO 高亮展示
9. `Todo Tree` #显示待办任务列表

**更多功能**

> 以下为可选安装配置项

10. `json`文件查看和编辑默认不支持注释，右下角可切换`Select Language Mode`，可切换为`JSON with Comments`。
11. `svg`图标文件预览，可安装`SVG`扩展。

#### 配置文件

```json
// .vscode/setting.json

{
    "window.title": "${activeEditorMedium}${separator}${rootName}",
    // #vscode默认启用了根据文件类型自动设置tabsize的选项
    "editor.detectIndentation": false,
    // #重新设定tabsize
    "editor.tabSize": 2,
    // #定义一个默认格式化程序, 该格式化程序优先于所有其他格式化程序设置。必须是提供格式化程序的扩展的标识符。
    "editor.defaultFormatter": null,
    // #每次保存的时候自动格式化
    "editor.formatOnSave": true,
    // #每次保存的时候将代码按eslint格式进行修复
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },

    /**
     * json自动格式化按prettier规则
     */
    "files.associations": {
        "*.json": "jsonc"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

    /**
     * js和vue文件，按eslint规则
     */
    // #Enable/disable default JavaScript formatter (For Prettier)
    "javascript.format.enable": false,
    // #让函数(名)和后面的括号之间加个空格
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    "eslint.run": "onType",
    "eslint.options": {
        "extensions": [".js", ".vue"]
    },
    "eslint.validate": ["javascript", "vue"],

    /**
     * .wxml文件单独配置
     */
    // 是否开启保存自动格式化
    "wxmlConfig.onSaveFormat": true,
    "wxmlConfig.format": {
        "editorconfig": true,
        "wrap_attributes_count": 3,
        "wrap_attributes": "force",
        "wrap-attributes-indent-size": 2,
        "end-with-newline": false,
        "indent_style": "space",
        "indent_size": 2,
        "indent_char": " ",
        "indent_with_tabs": false
    }
}
```

### 八、更多

> 对于项目特有的代码规范，可在此基础上增加配置规则即可。
> 另外，对于 `vscode` 配置文件，可提交至 `git`, 这样每个同学可以保证开发环境设置是一致的。
