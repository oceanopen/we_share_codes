# Nvm 设置镜像源

在国内使用 nvm 安装 Node.js 时，默认从 `nodejs.org` 下载，速度较慢。通过配置镜像源可以显著加速下载。

## 1. Mac / Linux 设置

通过 `NVM_NODEJS_ORG_MIRROR` 环境变量指定 Node.js 下载镜像。

在 `~/.zshrc`（macOS 默认）或 `~/.bashrc`（Linux）中添加：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

保存后执行：

```bash
source ~/.zshrc
```

验证：

```bash
echo $NVM_NODEJS_ORG_MIRROR
# https://npmmirror.com/mirrors/node

nvm ls-remote
# 正常列出所有 Node.js 版本
```

也可以临时使用（仅当前终端生效）：

```bash
NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm install 22
```

## 2. Windows 设置

### 方式一：命令行配置（推荐）

nvm-windows 支持 `nvm node_mirror` 命令直接设置：

```bash
# 设置 Node 镜像
nvm node_mirror https://npmmirror.com/mirrors/node/

# 设置 npm 镜像
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

设置后验证：

```bash
nvm install 22
```

### 方式二：修改配置文件

找到 nvm 安装目录下的 `settings.txt` 文件：

```bash
# 查看 nvm 安装路径
nvm root
# 输出: C:\Users\[user]\AppData\Roaming\nvm
```

编辑 `settings.txt`，添加或修改以下内容：

```txt
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

## 3. npm / pnpm 镜像源设置

nvm 镜像源仅加速 Node.js 二进制文件下载。npm 包的下载需要单独配置 registry 镜像。

### npm

```bash
# 查看当前 registry
npm config get registry

# 设置为国内镜像
npm config set registry https://registry.npmmirror.com

# 恢复为官方源
npm config set registry https://registry.npmjs.org
```

### pnpm

```bash
# 查看当前 registry
pnpm config get registry

# 设置为国内镜像
pnpm config set registry https://registry.npmmirror.com

# 恢复为官方源
pnpm config set registry https://registry.npmjs.org
```

### 使用 .npmrc 文件（项目级）

在项目根目录创建 `.npmrc` 文件：

```txt
registry=https://registry.npmmirror.com
```

## 4. 相关链接

- [npmmirror 镜像站](https://npmmirror.com/)
- [nvm 官方文档 - Use a mirror of node binaries](https://github.com/nvm-sh/nvm#use-a-mirror-of-node-binaries)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
