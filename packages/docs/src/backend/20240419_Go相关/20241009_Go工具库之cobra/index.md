# Go 工具库之 cobra

`cobra` 是一个命令行程序库，可以用来编写命令行程序。
同时，它也提供了一个脚手架，用于生成基于 `cobra` 的应用程序框架。

## 1. 快速使用

我们实现一个简单的命令行程序 `git`，当然这不是真的 `git`，只是模拟其命令行。
最终还是通过 `os/exec` 库调用外部程序执行真实的 `git` 命令，返回结果。
所以我们的系统上要先安装 `git`，且 `git` 在可执行路径中。

先初始化项目：

```bash
mkdir mygit
cd mygit
go mod init mygit
# go: creating new go.mod: module mygit
go get github.com/spf13/cobra
# go: added github.com/inconshreveable/mousetrap v1.1.0
# go: added github.com/spf13/cobra v1.8.1
# go: added github.com/spf13/pflag v1.0.5
```

目前我们只添加一个子命令 `version`。目录结构如下：

```
.
mygit
  ├── cmd
  |    ├── helper.go # 辅助函数
  |    ├── root.go # 根命令
  |    └── version.go # version 子命令
  ├── go.mod
  ├── go.sum
  └── main.go # 调用命令入口
```

每个 `cobra` 程序都有一个根命令，可以给它添加任意多个子命令。
我们在 `version.go` 的 `init` 函数中将子命令添加到根命令中。

开发完成后，先整理和清理项目的模块依赖关系：

```bash
go mod tidy
```

运行程序：

```bash
go run main.go version
# git version 2.39.2 (Apple Git-143)

go run . version
# git version 2.39.2 (Apple Git-143)
```

也可以 `编译程序`：

```bash
go build -o mygit
./mygit version
# git version 2.39.2 (Apple Git-143)
```

`cobra` 自动生成的帮助信息，`very cool`：

```bash
go run . -h
# Git is a free and open source distributed version control system
# designed to handle everything from small to very large projects
# with speed and efficiency.

# Usage:
#   git [flags]
#   git [command]

# Available Commands:
#   completion  Generate the autocompletion script for the specified shell
#   help        Help about any command
#   version     version subcommand show git version info.

# Flags:
#   -h, --help   help for git

# Use "git [command] --help" for more information about a command.
```

单个子命令的帮助信息：

```bash
go run . version -h
# version subcommand show git version info.

# Usage:
#   git version [flags]

# Flags:
#   -h, --help   help for version
```

未识别的子命令：

```bash
go run . clone
# Error: unknown command "clone" for "git"
# Run 'git --help' for usage.
```

## 2. 规范

使用 `cobra` 构建命令行时，程序的目录结构一般比较简单，推荐使用下面这种结构：

```
appName
  ├── cmd
  |    ├── cmd1.go # 子命令 cmd1
  |    ├── cmd2.go # 子命令 cmd2
  |    └── root.go # 根命令
  ├── go.mod
  ├── go.sum
  └── main.go # 调用命令入口
```

每个命令实现一个文件，所有命令文件存放在 `cmd` 目录下。
外层的 `main.go` 仅初始化 `cobra`。

## 3. 特性

cobra 提供非常丰富的功能：

- 轻松支持子命令，如 app server，app fetch 等；
- 完全兼容 POSIX 选项（包括短、长选项）；
- 嵌套子命令；
- 全局、本地层级选项。可以在多处设置选项，按照一定的顺序取用；
- 使用脚手架轻松生成程序框架和命令；

首先需要明确 3 个基本概念：

- 命令（Command）：就是需要执行的操作；
- 参数（Arg）：命令的参数，即要操作的对象；
- 选项（Flag）：命令选项可以调整命令的行为。

下面示例中，server 是一个（子）命令，--port 是选项：

```bash
hugo server --port=1313
```

下面示例中，clone 是一个（子）命令，URL 是参数，--bare 是选项：

```bash
git clone URL --bare
```

## 4. 命令

在 `cobra` 中，命令和子命令都是用 `Command` 结构表示的。`Command` 有非常多的字段，用来定制命令的行为。

- `Use` 指定使用信息，即命令怎么被调用，格式为 `name arg1 [arg2]`。`name` 为命令名，后面的 `arg1` 为必填参数，`arg2` 为可选参数，参数可以多个。
- `Short`、`Long`, 都是指定命令的帮助信息，只是前者简短，后者详尽而已。
- `Run` 是实际执行操作的函数。

定义新的子命令很简单，就是创建一个 `cobra.Command` 变量，设置一些字段，然后添加到根命令中。
例如我们要添加一个 `clone` 子命令：

```go
// cmd/clone.go

package cmd

import (
  "fmt"
  "os"

  "github.com/spf13/cobra"
)

var cloneCmd = &cobra.Command {
  Use: "clone url [destination]",
  Short: "Clone a repository into a new directory",
  Run: func(cmd *cobra.Command, args []string) {
    output, err := ExecuteCommand("git", "clone", args...)
    if err != nil {
      Error(cmd, args, err)
    }

    fmt.Fprintf(os.Stdout, output)
  },
}

func init() {
  rootCmd.AddCommand(cloneCmd)
}
```

其中 `Use` 字段 `clone url [destination]` 表示子命令名为 `clone`，参数 `url` 是必须的，目标路径 `destination` 可选。

可以这样使用：

```bash
go run . clone https://github.com/darjun/leetcode
# 或
go build -o mygit
./mygit clone https://github.com/darjun/leetcode
```

## 相关链接

- [Go 每日一库之 cobra](https://segmentfault.com/a/1190000021616743)
