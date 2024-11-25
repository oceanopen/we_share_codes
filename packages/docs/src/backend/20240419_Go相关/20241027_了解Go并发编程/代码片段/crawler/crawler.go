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
