# 基于 gin 的 go 项目支持 swagger

### 1. 安装 swag

```bash
go install github.com/swaggo/swag/cmd/swag@latest

swag --version
swag version v1.16.3
```

其中要先设置环境变量才能自动生效：

- go module 模式不需要配置以下的环境变量。且 gvm 管理 go 版本时，配置以下环境变量没有意义。

```bash
cat ~/.zshrc

# # 配置shell环境用户环境变量生效
# source ~/.bash_profile

cat ~/.bash_profile
# # ----------- go start -----------

# # go 安装目录
# export GOROOT=/usr/local/go
# export GOPATH=/Users/[user]/go
# # 设置环境变量
# export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

# # ---------- go end ---------------
```

使以上配置生效：

```bash
source ~/.bash_profile
source ~/.zshrc
```

### 2. 项目初始化

```bash
swag init
# 2024/04/19 14:49:40 Generate swagger docs....
# 2024/04/19 14:49:40 Generate general API Info, search dir:./
# 2024/04/19 14:49:41 create docs.go at docs/docs.go
# 2024/04/19 14:49:41 create swagger.json at docs/swagger.json
# 2024/04/19 14:49:41 create swagger.yaml at docs/swagger.yaml

```

```bash
cd docs && ls
# docs.go      swagger.json swagger.yaml
```

### 3. 安装项目依赖

```bash
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/files
```

其中 `-u` 的意思是，安装最新版本。

### 4. 项目引入

```go
// main.go

package main

import (
	"project-module/routers"
)

// @title 低代码平台服务
// @version 1.0
func main() {
  // ...
	r := routers.SetupRouter()
  // ...
}
```

```go
// routers/setup_router.go

package routers

import (
	"project_module/common"
)

func SetupRouter() *gin.Engine {
	r := gin.New()
  // ...

	common.InitSwagger(r)
  // ...
	return r
}

```

```go
// common/init_swagger.go

package common

import (
	"project_module/docs"

	"github.com/gin-gonic/gin"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func InitSwagger(r *gin.Engine) {

	// docs 访问地址: /swagger/index.html
	docs.SwaggerInfo.BasePath = "/api/" // 设置 api 路径前缀
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
}

```

### 5. 生成 swagger 文档

```bash
swag init
```

### 6. 访问 swagger 文档

`http://localhost:8000/swagger/index.html`

### 7. 参考

- [gin-swagger](https://github.com/swaggo/gin-swagger)
