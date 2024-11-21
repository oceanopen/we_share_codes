# Nvm 设置镜像源

## 1. Mac 设置

在使用 `NVM（Node Version Manager）` 管理 `Node.js` 版本时，可以使用 `NVM_NODEJS_ORG_MIRROR` 环境变量来指定 `Node.js` 安装包的镜像源地址。

```bash
vim ~/.bash_profile
```

增加以下内容：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ # 切换为国内镜像
```

保存退出，执行以下命令使配置生效：

```bash
source ~/.bash_profile
```

验证：

```bash
echo $NVM_NODEJS_ORG_MIRROR
# https://npmmirror.com/mirrors/node/

nvm ls-remote
# v0.1.14
# ...
```

另外也可以在终端直接执行：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
```

这样设置后，在当前终端窗口，nvm 就会使用 npmmirror.com 的镜像源了。

## 2. Windows 设置

在 `nvm` 的安装路径下，找到 `settings.txt` 文件，设置 `node_mirror` 与 `npm_mirror` 为国内镜像地址。

```bash
# 1. 使用 nvm root 命令 找到 nvm 所在位置
nvm root
# Current Root: C:\Users\[user]\AppData\Roaming\nvm
```

```bash
# 2. 找到 settings.txt
cd C:/Users/[user]/AppData/Roaming/nvm/
ll
# -rw-r--r-- 1 [user] 1049089      75 3月  29 15:12 settings.txt
```

```bash
# 3. 在 settings.txt 末尾加上：
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```
