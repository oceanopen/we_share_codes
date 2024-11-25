# 了解 Go 并发编程

![](./images/01_Using_Concurrency_in_Golang.png)

## 1. Goroutines：轻量级线程

`Goroutines` 是 `Go` 中实现并发的核心。
与传统的线程相比，`Goroutines` 是由 `Go` 运行时管理的，拥有更小的堆栈内存（通常几 KB），且创建和销毁的开销小，允许程序同时运行成千上万的 `Goroutines`。

### 1.1 启动与运行 Goroutine

```bash
go mod init concurrency_demo
# go: creating new go.mod: module concurrency_demo
```

在 `Go` 中，启动一个 `Goroutine` 非常简单。我们只需要在函数调用前加上 `go` 关键字。例如：

```go
package main

import (
    "fmt"
    "time"
)

func say(s string) {
	for i := 0; i < 5; i++ {
		time.Sleep(1 * time.Second)
		fmt.Println(s)
	}
}

func main() {
    go say("world")
    say("hello")
}
```

在这个例子中，`main` 函数中的 `go say("world")` 启动了一个新的 `goroutine`。
这意味着 `say("world")` 与 `say("hello")` 将并发执行。

运行，发现每间隔 `1S` 会打印出一对 `hello` 和 `world`，两者顺序是不定的：

```bash
go run main.go
# world
# hello
# hello
# world
# world
# hello
# hello
# world
# world
# hello
```

再次运行，我们会发现，每 `1S` 同样会打印一对 `hello` 和 `world`，但执行结果是有变化的：

```bash
go run main.go
# hello
# world
# world
# hello
# world
# hello
# hello
# world
# world
# hello
```

### 1.2 Goroutine 的调度

`Go` 使用了基于 `M:N 调度模型`（多个 `goroutines` 可以在多个 `OS` 线程上运行）。
`Go` 调度器在运行时分配 `goroutines` 到可用的逻辑处理器，然后将这些逻辑处理器绑定到单个 `OS` 线程。

## 2. Channels：协程间的通信

`Channels` 是 `Go` 中用于在 `goroutines` 之间安全传递数据的机制。
通过使用 `channels`，开发者可以避免`传统并发程序`中常见的`竞态条件`和`锁`问题。

### 2.1 创建和使用 Channel

我们可以使用 `make` 函数创建一个新的 `channel`：

```go
ch := make(chan int)
```

`Goroutines` 通过 `channel` 发送和接收数据，操作符为 `<-`。例如：

```go
ch <- v // 发送 v 到 channel ch
v := <-ch // 从 ch 接收数据并赋值给 v
```

### 2.2 Channel 的阻塞行为

`Channels` 的重要特性之一是它们的阻塞行为。
如果一个 `goroutine` 试图从一个空的 `channel` 接收数据，它会阻塞，直到有数据可读。
同样，如果一个 `goroutine` 试图向一个满的（或未准备好的接收者）`channel` 发送数据，它也会阻塞，直到数据被读取。

## 3. 实战案例：并发的 Web 爬虫

考虑一个简单的 `Web` 爬虫，它使用 `goroutines` 并发地抓取网页，并通过一个共享的 `channel` 传递数据：

```go
// crawler/crawler.go

package crawler

import (
	"fmt"
	"net/http"
	"time"
)

func fetch(url string, ch chan<- string) {
	start := time.Now()

	resp, err := http.Get(url)
	if err != nil {
		ch <- fmt.Sprintf("url: %s, error: %s", url, err)
		return
	}

	ch <- fmt.Sprintf("%s, %s, %dms", url, resp.Status, time.Since(start).Milliseconds())
}

func Run() {
	urls := []string{
		"https://www.google.com",
		"https://cn.bing.com/",
		"https://www.baidu.com",
	}

	ch := make(chan string)
	for _, url := range urls {
		go fetch(url, ch)
	}

	for range urls {
		fmt.Println(<-ch)
	}
}

```

```go
// main.go
package main

import "concurrency_demo/crawler"

func main() {
	crawler.Run()
}

```

运行效果：

```bash
go run main.go
# https://www.baidu.com, 200 OK, 73ms
# https://cn.bing.com/, 200 OK, 380ms
# url: https://www.google.com, error: Get "https://www.google.com": dial tcp 142.250.217.68:443: i/o timeout
```

## 4. 总结

通过 `goroutines` 和 `channels`，`Go` 为并发编程提供了强大而简洁的工具。
这些特性使得开发并行程序和管理复杂的并发状态变得更加容易。
随着对这些机制的深入了解，我们将能够更有效地利用现代多核硬件，编写高效、可靠的 `Go` 程序。
