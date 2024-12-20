# 前端项目 Git 提交约束配置

## 1. 准备工作

- `husky`: 触发 `Git Hooks`, 执行脚本；

```bash
npm install -D husky
```

> package.json

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint --ext .js,.ts ./src --fix"
  }
}
```

```bash
npm run prepare
# > husky install
# husky - Git hooks installed
```

这个时候，我们发现在项目根目录下，多了一个文件夹：

```
.
├── .husky
|    ├── -
|    |   └── husky.sh
|    └── .gitignore
```

## 2. 代码格式校验

- `lint-staged`: 检测文件，只对暂存区中有改动的文件进行检测，可以在提交前进行 Lint 操作；

```bash
npm install -D lint-staged
```

> package.json

```json
{
  "scripts": {
    "lint-staged": "lint-staged --allow-empty"
  },
  "lint-staged": {
    "src/**/*.{js,ts}": ["eslint --fix"]
  }
}
```

```bash
npx husky add .husky/pre-commit "npm run lint-staged"
# husky - created .husky/pre-commit
```

执行后，我们发现，`.husky` 目录下多了一个文件：

```
.
├── .husky
|    └── pre-commit
```

```bash
cat ./.husky/pre-commit
# #!/bin/sh
# . "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

## 3. Git 提交消息格式校验

- `commitizen`: 使用规范化的 `message` 提交；
- `commitlint`: 检查 `message` 是否符合规范；
- `cz-conventional-changelog`: 适配器。提供 `conventional-changelog` 标准（约定式提交标准）。
  基于不同需求，也可以使用不同适配器（比如: `cz-customizable`）。

```bash
npm install -D commitizen @commitlint/config-conventional @commitlint/cli
```

`Commitizen` 是一个主流的 `Commit message` 的生成工具，支持 `Angular` 的 `commit message` 格式，被众多主流框架采用。

安装完成后，需要在项目目录下，输入以下命令来初始化您的项目，以使用 `cz-conventional-changelog` 适配器：

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

- 安装 `cz-conventional-changelog`;
- 保存其依赖到 `package.json` 中；
- 添加 `config.commitizen key` 到 `package.json` 中，如下：

  ```json
  {
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    }
  }
  ```

然后使用 `git cz` 代替 `git commit` 命令即可，或者可以增加友好的 `npm` 命令，通过 `npm run commit` 进行提交：

```json
{
  "scripts": {
    "commit": "git cz"
  }
}
```

此时我们已经根据约定规范提交了消息，但是我们怎么知道提交的消息是不是正确的呢？
那么接下来就需要配置刚刚介绍到的 `commitlint`, 只需要一句命令即可完成配置，它会在项目根目录下面创建一个 `commitlint.config.js` 配置文件：

```bash
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

它会使用 `@commitlint/config-conventional` 这个包里面提供的校验规则进行校验，你可以理解为 `ESLint` 的规则。

有了这个校验工具，怎么才可以触发校验呢，我们希望在提交代码的时候就进行校验，这时候 `husky` 就可以出场了，他可以触发 `Git Hook` 来执行相应的脚本，而我们只需要把刚刚的校验工具加入脚本就可以了。

我们需要定义触发 `hook` 时要执行的 `Npm` 脚本：

> package.json

```json
{
  "scripts": {
    "commitlint": "commitlint --config commitlint.config.js -e -V"
  }
}
```

> 设置 `commit-msg` 钩子，提交 `message` 执行校验。

```bash
npx husky add .husky/commit-msg "npm run commitlint"
# husky - created .husky/commit-msg
```

## 4. 更多

此时已经完成配置了，现在团队里面任何成员的提交必须按照严格的规范进行了。

## 5. 参考

- [基于 Vite2+Vue3 的项目复盘总结](https://mp.weixin.qq.com/s/zZNcxm4cndOcdpwkw_AUzg)
