# Mac 下安装 Go 开发环境

本文章采用 `GVM` 方式管理，`GVM2` 没有实际验证。

### 0. 参考

- [GVM]https://github.com/moovweb/gvm
- [GVM2]https://github.com/markeissler/gvm2
- [go1.4 -B 安装失败](https://github.com/moovweb/gvm/issues/264)

### 1. GVM 安装

```bash
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
# Cloning from https://github.com/moovweb/gvm.git to /Users/[user]/.gvm
# macOS detected. User shell is: /bin/zsh
# No existing Go versions detected
# Installed GVM v1.0.22

# Please restart your terminal session or to get started right away run
#  `source /Users/[user]/.gvm/scripts/gvm`

```

```bash
source /Users/[user]/.gvm/scripts/gvm
```

```bash
gvm version
# Go Version Manager v1.0.22 installed at /Users/gaokeke/.gvm

```

安装 `go` 版本，需要终端设置代理。

### 2. GO 安装

```bash
gvm list

# gvm gos (installed)

```

```bash
gvm listall

# gvm gos (available)

#    go1
#    go1.0.1

```

文档上说，需要先安装 `go1.4` 版本，但实测，可以直接安装 `1.20+` 版本。

```bash
# 如果要安装 go1.4 版本，不支持 -B, 只能 --binary
gvm install go1.4 --binary

# -B 指的是 --binary
gvm install go1.22.2 -B
```

```bash
gvm use go1.22.2 --default
# Now using version go1.22.2

```

```bash
go version
# go version go1.22.2 darwin/arm64

```

```bash
gvm list

# gvm gos (installed)

# => go1.22.2

```

```bash
go env
# GO111MODULE=''
# GOARCH='arm64'
# GOBIN=''
# GOCACHE='/Users/gaokeke/Library/Caches/go-build'
# GOENV='/Users/gaokeke/Library/Application Support/go/env'
# GOEXE=''
# GOEXPERIMENT=''
# GOFLAGS=''
# GOHOSTARCH='arm64'
# GOHOSTOS='darwin'
# GOINSECURE=''
# GOMODCACHE='/Users/gaokeke/.gvm/pkgsets/go1.22.2/global/pkg/mod'
# GONOPROXY=''
# GONOSUMDB=''
# GOOS='darwin'
# GOPATH='/Users/gaokeke/.gvm/pkgsets/go1.22.2/global'
# GOPRIVATE=''
# GOPROXY='https://proxy.golang.org,direct'
# GOROOT='/Users/gaokeke/.gvm/gos/go1.22.2'
# GOSUMDB='sum.golang.org'
# GOTMPDIR=''
# GOTOOLCHAIN='auto'
# GOTOOLDIR='/Users/gaokeke/.gvm/gos/go1.22.2/pkg/tool/darwin_arm64'
# GOVCS=''
# GOVERSION='go1.22.2'
# GCCGO='gccgo'
# AR='ar'
# CC='clang'
# CXX='clang++'
# CGO_ENABLED='1'
# GOMOD='/dev/null'
# GOWORK=''
# CGO_CFLAGS='-O2 -g'
# CGO_CPPFLAGS=''
# CGO_CXXFLAGS='-O2 -g'
# CGO_FFLAGS='-O2 -g'
# CGO_LDFLAGS='-O2 -g'
# PKG_CONFIG='pkg-config'
# GOGCCFLAGS='-fPIC -arch arm64 -pthread -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -ffile-prefix-map=/var/folders/vd/r9fy_nkj7zg04snvxdph2pm40000gn/T/go-build2425795596=/tmp/go-build -gno-record-gcc-switches -fno-common'

```

```bash
cat ~/.zshrc
# MORE ...

# GVM 设置
# [[ -s "/Users/gaokeke/.gvm/scripts/gvm" ]] && source "/Users/gaokeke/.gvm/scripts/gvm"

```

安装后，可以看到离线包信息：

```bash
cd ~/.gvm/archive
ls
# go1.21.10.darwin-amd64.tar.gz
# go1.22.3.darwin-amd64.tar.gz
# package
```

所以也可以访问 `https://go.dev/dl/`, 下载 `go1.22.3.darwin-amd64.tar.gz` 离线包放到这个目录下，再执行 `gvm install go1.22.3` 安装。

### 3. 启用 Go Modules 功能

```bash
go env -w GO111MODULE=on
```

```bash
go env
# GO111MODULE='on'
# MORE ...
```

也可以通过环境变量方式设置:

```bash
cat ~/.bash_profile

# # ------------ go start ------------
# export GO111MODULE=on
# export GOPROXY=https://goproxy.cn,direct
# # ------------ go end --------------
```

### 4. 配置代理

```bash
# 配置 GOPROXY 环境变量，以下三选一

# 1. 七牛 CDN
go env -w GOPROXY="https://goproxy.cn,direct"

# 2. 阿里云
go env -w GOPROXY="https://mirrors.aliyun.com/goproxy/,direct"

# 3. 官方
go env -w GOPROXY="https://proxy.golang.org,direct"
```

### 5. 测试项目

```bash
mkdir -p hello
cd hello
go mod init demo
# go: creating new go.mod: module demo

ls
# go.mod

cat go.mod
# module demo

# go 1.22.2

```

```bash
cat hello.go

# package main

# import "fmt"

# func main() {
#   fmt.Println("Hello, World!")
# }
```

```bash
$ go mod tidy

$ go run hello.go
Hello, World!

```

### 6. Go 安装项目依赖

如安装日志库：

```bash
cd [project-dir]
go get github.com/sirupsen/logrus
```

### 7. `go get` 和 `go get -u` 的区别

`go get` 和 `go get -u` 的区别在于是否会更新依赖包到最新版本。

`go get` 是用来下载和安装指定的包的。如果这个包已经存在，`go get` 会跳过下载步骤。它会递归的去处理依赖。

`go get -u` 会加入更新的动作，它会将已存在的库更新到最新版本，然后进行编译安装。

从 `Go 1.16` 开始，`go get` 命令在处理模块依赖时的行为有了改变。`go get` 默认不再更新模块的依赖，如果你需要更新模块依赖，必须使用 `go get -d`。更详细的信息可以查阅 [Go 1.16](https://go.dev/doc/go1.16#go-command) 的发布说明。

注意: 使用 `go get -u` 更新库的时候需要注意，因为这可能会更新你项目的很多间接依赖到新版本，有可能会引入不稳定或者和你当前项目存在兼容问题的代码，所以在实际操作时需要谨慎。在实际开发中，正式项目通常会锁定具体的依赖版本来避免可能的问题。

### 8. 如何查看 Go 的版本

```bash
go version
# go version go1.20.5 darwin/amd64
```

### 9. 如何查看 Go 的安装路径

```bash
go env
# GO111MODULE="on"
# GOPROXY="http://goproxy.weoa.com"
# GOROOT="/Users/[user]/go"
# GOSUMDB="off"
```

其中要关注的是 `GOROOT` 的路径，它就是 Go 的安装路径。

设置环境变量需要用到 `GOROOT`，否则 `go get` 安装的包无法使用。

### 10. 环境变量设置

```bash
cat ~/.bash_profile

# go 安装目录
# export GOROOT=/usr/local/go
export GOROOT=/Users/[username]/go
# 设置环境变量
export PATH=$PATH:$GOROOT/bin

# 模块代理打开
export GO111MODULE=on
# 默认模块代理地址
# export GOPROXY=https://goproxy.io,direct
# 设置国内模块代理地址
export GOPROXY=https://goproxy.cn,direct
```

### 11. 安装 air，实现热加载调试

[air 文档](https://github.com/cosmtrek/air/blob/master/README-zh_cn.md)

使用 `Go` 的版本为 `1.22` 或更高:

```bash
# Go 1.16 以下版本，因为不支持 go install 命令，需要手动下载
# 它是安装到 GOPATH 目录下的 bin 目录下
# go get -u github.com/cosmtrek/air

# Go 1.16 以上版本，已经没有 GOPATH 的概念，可以直接使用 go install 命令
# 经过实际验证，其实也是安装到 GOPATH 目录下的 bin 目录下
go install github.com/cosmtrek/air@latest
```

### 12. 更多

如果 gvm 安装 go 后，终端频繁提示：

```bash
# ERROR: Invalid or corrupt Go version
```

原因：gvm 未指定默认环境。

修复：指定默认环境。

```bash
gvm use go1.22.3 --default
```
