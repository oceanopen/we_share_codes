# Mac 卸载 Go

```bash
which go
# /usr/local/go/bin/go
```

```bash
rm -rf /usr/local/go
```

```bash
rm -rf /etc/paths.d/go
```

```bash
vi ~/.bash_profile
```

删除相关信息:

```bash
# ----------- go start -----------

# go 安装目录
export GOROOT=/usr/local/go
export GOPATH=/Users/[user]/go
# 设置环境变量
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

# 模块代理打开
export GO111MODULE=on
# 设置国内模块代理地址
export GOPROXY=https://goproxy.io,direct

# ---------- go end ---------------
```

```bash
source ~/.bash_profile
```
