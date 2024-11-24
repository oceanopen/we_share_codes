# 如何查找运行进程 PID

查找进程信息：

```bash
ps -e | grep ollama
# 50536 ??         0:00.36 /Applications/Ollama.app/Contents/Resources/ollama serve
# 63877 ttys002    0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn ollama
```

不显示 `grep` 本身：

```bash
ps -e | grep ollama | grep -v grep
# 50536 ??         0:00.36 /Applications/Ollama.app/Contents/Resources/ollama serve
```

显示进程号 `PID`：

```bash
ps -e | grep ollama | grep -v grep | awk '{print $1}'
# 50536
```

或者使用 `pgrep` 命令：

```bash
ps -e | pgrep ollama
# 50536
```
