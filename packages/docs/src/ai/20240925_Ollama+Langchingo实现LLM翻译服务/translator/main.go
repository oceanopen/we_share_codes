package main

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
	"github.com/tmc/langchaingo/prompts"
)

func main() {
	r := gin.Default()

	v1 := r.Group("/api/v1")

	v1.POST("/translate", translator)

	r.Run(":8090")
}

func translator(c *gin.Context) {
	var requestData struct {
		OutputLang string `json:"outputLang"`
		InputText  string `json:"inputText"`
	}

	// 解析请求数据
	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if requestData.InputText == "" || requestData.OutputLang == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errors.New("参数缺失").Error(),
		})
		return
	}

	// 创建 prompt
	prompt := prompts.NewChatPromptTemplate([]prompts.MessageFormatter{
		prompts.NewSystemMessagePromptTemplate("你是一个只能翻译文本的翻译引擎，不需要进行解释。", nil),
		prompts.NewHumanMessagePromptTemplate("翻译这段文字到 {{.outputLang}}: {{.inputText}}", []string{"outputLang", "inputText"}),
	})

	// 填充 prompt
	vals := map[string]any{
		"outputLang": requestData.OutputLang,
		"inputText":  requestData.InputText,
	}

	messages, err := prompt.FormatMessages(vals)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// 连接 Ollama
	// 若不设置 ollamaServerURL 或 环境变量 OLLAMA_HOST, 则默认使用本地 ollama 服务
	llm, err := ollama.New(ollama.WithModel("qwen2.5:1.5b"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// 获取回复内容
	content := []llms.MessageContent{
		llms.TextParts(messages[0].GetType(), messages[0].GetContent()),
		llms.TextParts(messages[1].GetType(), messages[1].GetContent()),
	}
	response, err := llm.GenerateContent(context.Background(), content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response.Choices[0].Content,
	})
}
