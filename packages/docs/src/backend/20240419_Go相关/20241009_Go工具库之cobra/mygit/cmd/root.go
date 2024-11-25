package cmd

import (
	"errors"

	"github.com/spf13/cobra"
)

// 根命令
var rootCmd = &cobra.Command{
	Use:   "git",
	Short: "Git is a distributed version control system.",
	Long: `Git is a free and open source distributed version control system
designed to handle everything from small to very large projects 
with speed and efficiency.`,
	Run: func(cmd *cobra.Command, args []string) {
		// 这里不支持根命令执行，所以直接报错
		Error(cmd, args, errors.New("unrecognized command"))
	},
}

func Execute() {
	rootCmd.Execute()
}
