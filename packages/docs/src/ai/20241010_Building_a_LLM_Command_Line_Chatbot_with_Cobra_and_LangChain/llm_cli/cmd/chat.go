package cmd

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/spf13/cobra"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

// chatCmd represents the chat command
var chatCmd = &cobra.Command{
	Use:   "chat",
	Short: "LLM chatbot",
	Long:  `LLM chatbot`,
	Run: func(cmd *cobra.Command, args []string) {
		// read input lines form the user
		// so let's create a new reader that reads from stdin
		reader := bufio.NewReader(os.Stdin)

		// Set up a channel to listen for interrupt signals
		signalChan := make(chan os.Signal, 1)
		// syscall.SIGINT 表示中断信号，通常由用户按下 Ctrl+C 键触发。
		// syscall.SIGTERM 表示终止信号，通常用于请求进程正常终止。
		signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

		// 监听到退出信号时，退出程序
		go func() {
			<-signalChan
			fmt.Println("\n Interrupt signal received. Exiting...")
			os.Exit(0)
		}()

		// 连接 Ollama
		// 若不设置 ollamaServerURL 或 环境变量 OLLAMA_HOST, 则默认使用本地 ollama 服务
		llm, err := ollama.New(ollama.WithModel("qwen2.5:1.5b"))
		if err != nil {
			log.Fatal(err)
		}

		ctx := context.Background()

		// Initial LLM prompt phase
		fmt.Print("Enter initial prompt for LLM: ")
		initialPrompt, _ := reader.ReadString('\n')
		initialPrompt = strings.TrimSpace(initialPrompt)
		content := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeSystem, initialPrompt),
		}
		fmt.Println("Initial prompt receieved. Entering chat mode...")

		// input we will create an infinite Loop in which the user can ask questions to llm infinitely.
		for {
			fmt.Println()
			fmt.Print("> ")

			// 从输入流中读取字符串直到遇到换行符 '\n' 为止
			input, _ := reader.ReadString('\n')
			input = strings.TrimSpace(input)

			switch input {
			// "/bye" 是为了和 Ollama 的终端交互退出 chat 保持一致
			case "quit", "exit", "/bye":
				fmt.Printf("Exiting ...")
				os.Exit(0)
			default:
				// Process user input with the LLM here
				response := ""
				// 将输入内容添加到上下文中
				content = append(content, llms.TextParts(llms.ChatMessageTypeHuman, input))
				llm.GenerateContent(ctx, content, llms.WithMaxTokens(1024), llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
					fmt.Print(string(chunk))
					response = response + string(chunk)
					return nil
				}))
				// 将回复内容添加到上下文中
				content = append(content, llms.TextParts(llms.ChatMessageTypeSystem, response))
			}
		}
	},
}

func init() {
	rootCmd.AddCommand(chatCmd)
}
