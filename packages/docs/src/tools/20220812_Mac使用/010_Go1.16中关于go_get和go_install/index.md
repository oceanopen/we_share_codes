# Go 1.16 中关于 go get 和 go install 你需要注意的地方

## 1. 前言

注意，从 `Go 1.16` 开始，`GOPATH` 模式已被官方声明为废弃状态，建议尽可能使用 `Go Modules` 来管理你的项目。
所以任何与 `GOPATH` 有关的设置都不要再使用了。

## 2. GO111MODULE

`GO111MODULE` 默认为 `on` ，如果要恢复到之前的行为，则需要将 `GO111MODULE` 设置为 `auto` ，这样差不多意味着 `GOPATH` 模式要逐步淡出人们的视野了；

`go install` 命令可以接受一个版本后缀了，（例如，`go install sigs.k8s.io/kind@v0.9.0`），并且它是在模块感知的模式下运行，可忽略当前目录或上层目录的 `go.mod` 文件。这对于在不影响主模块依赖的情况下，安装二进制很方便；

在将来，`go install` 被设计为“用于构建和安装二进制文件”， `go get` 则被设计为 “用于编辑 `go.mod` 变更依赖”，并且使用时，应该与 `-d` 参数共用，在将来版本中` -d` 可能会默认启用；

`go build` 和 `go test` 默认情况下不再修改 `go.mod` 和 `go.sum`。可通过 `go mod tidy` ，`go get` 或者手动完成；

## 3. 总结

总结而言，关于 `go install` 和 `go get` 必须要注意的是：

基本上 `go install <package>@<version>` 是用于命令的全局安装：
例如：`go install sigs.k8s.io/kind@v0.9.0`;

`go get` 安装二进制的功能，后续版本将会删除；
`go get` 主要被设计为修改 `go.mod` 追加依赖之类的，但还存在类似 `go mod tidy` 之类的命令，所以使用频率可能不会很高；

## Go 1.16 中已解决的工具安装问题

`Go` 使用 `go get` 命令，将我们需要的工具安装到 `$GOPATH/bin` 目录下，但这种方式存在一个很严重的问题。
`go get` 由于具备更改 `go.mod` 文件的能力，因此我们 必须要避免执行 `go get` 命令时，让它接触到我们的 `go.mod` 文件 ，否则它会将我们安装的工具作为一个依赖。

目前的解决方案通常是：

```bash
go install sigs.k8s.io/kind@v0.9.0
```

非常的简单直观。

需要注意的是 `go install <package>@<version>` 是从 `1.16` 开始增加的，无论你当前是否在一个模块下，此命令都会在 `$GOPATH/bin` 下安装指定版本的工具。

此外由于 `Go 1.16` 中 `GO111MODULE` 默认是打开的，`go install` 不会修改 `go.mod` 之类的文件，不会造成任何意外。

# 初始化模块

```bash
cd /go/src/github.com/moelove/iris
go mod init
# go: creating new go.mod: module github.com/moelove/iris
cat go.mod
# module github.com/moelove/iris
#
# go 1.16
```

# 用 go get -d 下载

```bash
cd /go/src/github.com/moelove/iris
go get -d sigs.k8s.io/kind
# go get: added sigs.k8s.io/kind v0.9.0
```

# 可以看到已经被添加到了模块依赖中

```bash
cd /go/src/github.com/moelove/iris
cat go.mod
# module github.com/moelove/iris
#
# go 1.16
#
# require sigs.k8s.io/kind v0.9.0 // indirect
```
