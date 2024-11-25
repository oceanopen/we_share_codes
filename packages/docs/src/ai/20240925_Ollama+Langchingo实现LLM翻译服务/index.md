# Ollama + Langchin 实现 LLM 翻译服务

## 1. 相关技术栈

- [Ollama](https://github.com/ollama/ollama): 本地运行`大语言模型（LLM）`的一个工具；
- [Langchaingo](https://github.com/tmc/langchaingo): 帮助在应用程序中使用`大语言模型（LLM）`的编程框架，可以理解为 `LangChain` 的 `Go` 实现版本；
- [Gin](https://github.com/gin-gonic/gin): `Go` 的一个 `web` 框架；

## 2. 环境依赖

```bash
# 安装 ollama
ollama -v
# ollama version is 0.3.11

# 安装 go
go version
# go version go1.22.3 darwin/amd64
```

## 2. 翻译器功能

- 提示语：你是一个只能翻译文本的翻译引擎，不需要进行解释。翻译这段文字到

  ```
  {{.outputLang}}: {{.inputText}}
  ```

- 比如：你是一个只能翻译文本的翻译引擎，不需要进行解释。翻译这段文字到英文：今天天气不错。

## 3. 项目初始化

```bash
# 创建项目目录
mkdir translator
cd translator

# 初始化项目
go mod init translator

# 工具库依赖
go get github.com/gin-gonic/gin
go get github.com/tmc/langchaingo/llms
```

## 4. Ollama 服务启动

先看下本地大模型列表：

```bash
ollama list
# NAME            ID              SIZE      MODIFIED
# qwen2.5:1.5b    65ec06548149    986 MB    28 hours ago
```

一般来说，判断本机是否能运行此模型，看上面的 `SIZE` 是否低于本机的 `显存大小`，否则会有明显卡顿或者运行失败的情况。

为了便于直观查看大模型运行过程，所以这里是调试模式启动的。

```bash
ollama serve
# 2024/09/25 16:45:46 routes.go:1153: INFO server config env="map[HTTPS_PROXY: HTTP_PROXY: NO_PROXY: OLLAMA_DEBUG:false OLLAMA_FLASH_ATTENTION:false OLLAMA_GPU_OVERHEAD:0 OLLAMA_HOST:http://127.0.0.1:11434 OLLAMA_KEEP_ALIVE:5m0s OLLAMA_LLM_LIBRARY: OLLAMA_LOAD_TIMEOUT:5m0s OLLAMA_MAX_LOADED_MODELS:0 OLLAMA_MAX_QUEUE:512 OLLAMA_MODELS:/Users/gaopan/.ollama/models OLLAMA_NOHISTORY:false OLLAMA_NOPRUNE:false OLLAMA_NUM_PARALLEL:0 OLLAMA_ORIGINS:[http://localhost https://localhost http://localhost:* https://localhost:* http://127.0.0.1 https://127.0.0.1 http://127.0.0.1:* https://127.0.0.1:* http://0.0.0.0 https://0.0.0.0 http://0.0.0.0:* https://0.0.0.0:* app://* file://* tauri://*] OLLAMA_SCHED_SPREAD:false OLLAMA_TMPDIR: http_proxy: https_proxy: no_proxy:]"
# time=2024-09-25T16:45:46.538+08:00 level=INFO source=images.go:753 msg="total blobs: 5"
# time=2024-09-25T16:45:46.539+08:00 level=INFO source=images.go:760 msg="total unused blobs removed: 0"
# time=2024-09-25T16:45:46.540+08:00 level=INFO source=routes.go:1200 msg="Listening on 127.0.0.1:11434 (version 0.3.11)"
# time=2024-09-25T16:45:46.541+08:00 level=INFO source=common.go:135 msg="extracting embedded files" dir=/var/folders/dq/pd5gw3qn5hs2n8p7kmd1r4qr0000gn/T/ollama1951039857/runners
# time=2024-09-25T16:45:46.581+08:00 level=INFO source=common.go:49 msg="Dynamic LLM libraries" runners="[cpu_avx cpu_avx2 cpu]"
# time=2024-09-25T16:45:46.581+08:00 level=INFO source=types.go:107 msg="inference compute" id="" library=cpu variant=avx2 compute="" driver=0.0 name="" total="16.0 GiB" available="6.3 GiB"
```

不报错，说明就已经启动成功了。由输出日志 `Listening on 127.0.0.1:11434 (version 0.3.11)` 可以看到，启动服务地址为: `http://127.0.0.1:11434`。

## 5. 应用开发

```go
// 详见 translator/main.go
```

## 6. 本地运行

```bash
# 更新依赖配置
go mod tidy

# 运行应用
go run main.go
# [GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

# [GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
#  - using env: export GIN_MODE=release
#  - using code:  gin.SetMode(gin.ReleaseMode)

# [GIN-debug] POST   /api/v1/translate         --> main.translator (3 handlers)
# [GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
# Please check https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies for details.
# [GIN-debug] Listening and serving HTTP on :8090
```

测试不传参数的情况:

```bash
curl http://localhost:8090/api/v1/translate -d '{}'
# {"error":"参数缺失"}
```

测试翻译英文：

```bash
curl http://localhost:8090/api/v1/translate -d '{
  "outputLang": "English",
  "inputText": "今天天气不错！"
}'
# {"response":"The weather is nice today!"}
```

测试翻译中文：

```bash
curl http://localhost:8090/api/v1/translate -d '{
  "outputLang": "中文",
  "inputText": "The weather is nice today!"
}'
# {"response":"今天天气不错！"}
```

测试翻译日语：

```bash
curl http://localhost:8090/api/v1/translate -d '{
  "outputLang": "日语",
  "inputText": "The weather is nice today!"
}'
# {"response":"今日の天気は良いですね！"}
```

## 7. 参考

- [利用 golang 加 ollama 加 langchain 轻松打造本地 LLM 应用](https://www.bilibili.com/video/BV1Qm41127WA/)
