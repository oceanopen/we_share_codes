package main

import (
	"fmt"
	"github_oauth_backend_demo/open_login"
	"log"
	"net/http"
	"net/url"
)

const (
	clientID     = ""                               // 确保与 GitHub 应用信息一致
	clientSecret = ""                               // 确保与 GitHub 应用信息一致
	redirectURI  = "http://localhost:8080/api/auth" // 确保与 GitHub 应用配置一致
)

func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/api/auth", authHandler)

	addr := ":8080"
	log.Printf("Server is starting on http://localhost%s ...", addr)

	/*
		1. 	http.ListenAndServe 在没有错误的情况下是会一直运行的，只有当遇到错误时才会返回。
				所以，等价于：
				err := http.ListenAndServe(":8080", nil)
				if err != nil {
					log.Fatal(err)
				}
		2. 第二个传参为 nil，表示 用默认的 HTTP 多路复用器 http.DefaultServeMux 来注册路由和处理函数。
	*/
	log.Fatal(http.ListenAndServe(addr, nil))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	authURL := "https://github.com/login/oauth/authorize"

	u, err := url.Parse(authURL)
	if err != nil {
		http.Error(w, "Failed to build URL", http.StatusInternalServerError)
		return
	}

	q := u.Query()
	q.Set("client_id", clientID)
	q.Set("redirect_uri", redirectURI)

	u.RawQuery = q.Encode()

	http.Redirect(w, r, u.String(), http.StatusFound) // 重定向到 Github 授权页地址
}

func authHandler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	fmt.Println("Authorization code:", code)

	info, err := open_login.NewGithubLogin(code, open_login.GithubConfig{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURI:  redirectURI,
	})
	if err != nil {
		fmt.Println("Error getting user info:", err)
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	fmt.Printf("UserInfo: %s", info)
	fmt.Fprintf(w, "%s", info)
}
