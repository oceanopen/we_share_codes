package test_cnt

import (
	"fmt"
	"runtime"
	"sync"
)

func TestCnt1() {
	cnt := 0
	total := 100000
	var wg sync.WaitGroup

	wg.Add(1)
	wg.Add(1)

	write := func() {
		for i := 0; i < total; i++ {
			cnt += 1
		}
		wg.Done()
	}

	go write()
	go write()
	wg.Wait()

	// 本次打印值不是 200000
	fmt.Println("cnt:", cnt)
}

func TestCnt2() {
	cnt := 0
	total := 100000
	m := sync.Mutex{}
	var wg sync.WaitGroup

	wg.Add(1)
	wg.Add(1)

	write := func() {
		for i := 0; i < total; i++ {
			m.Lock()
			cnt += 1
			m.Unlock()
		}
		wg.Done()
	}

	go write()
	go write()
	wg.Wait()

	// 本次打印值一定是 200000
	fmt.Println("cnt:", cnt)
}

func TestCnt3() {
	// 把逻辑处理器设置为 1，那么所有 Go routine 都将串行执行
	runtime.GOMAXPROCS(1)

	cnt := 0
	total := 100000
	var wg sync.WaitGroup

	wg.Add(1)
	wg.Add(1)

	write := func() {
		for i := 0; i < total; i++ {
			cnt += 1
		}
		wg.Done()
	}

	go write()
	go write()
	wg.Wait()

	// 本次打印值一定是 200000
	fmt.Println("cnt:", cnt)
}
