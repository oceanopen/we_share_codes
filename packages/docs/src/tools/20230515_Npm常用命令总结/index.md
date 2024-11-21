# Npm 常用命令总结

## 1. 安装依赖包

```bash
# 安装模块，若不指定版本号，则默认会安装最新的版本
npm install packagename

# 安装指定版本的模块
npm install packagename@0.0.1

# --save、-S 参数意思是把模块的版本信息保存到 dependencies（生产环境依赖）中
# 即你的 package.json 文件的 dependencies 字段中
npm install packagename --save
npm install packagename -S

# --save-dev、-D 参数意思是吧模块版本信息保存到 devDependencies（开发环境依赖）中
# 即你的 package.json 文件的 devDependencies 字段中
npm install packagename --save-dev
npm install packagename -D

# --save-exact、-E 参数的意思是精确的安装指定版本的模块
# 你会发现 dependencies 字段里每个模块版本号前面的 ^ 不见了
npm install packagename --save-exact
npm install packagename -E
```

## 2. 查看 npm 包某个具体版本及所有版本

```bash
# 查看 npm 服务器上该包的最新版本及详细信息
npm info jquery

# 查看 npm 服务器上所有的版本信息
npm view jquery versions

# 查看 npm 服务器上的最新的版本
npm view jquery version
```

## 3. 查看本地已经安装的包的版本信息

```bash
# 查看某个项目安装的包版本信息，命令必须在某个项目下执行
npm ls jquery

# 查看全局安装的包版本信息
npm ls jquery -g
```
