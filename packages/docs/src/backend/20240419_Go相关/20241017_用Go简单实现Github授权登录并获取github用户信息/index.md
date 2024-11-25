# 用 Go 简单实现 Github 授权登录并获取 github 用户信息

## 1. Web 应用程序流程

授权应用程序用户的 `web` 应用程序流程是：

- 用户被重定向，以请求他们的 `GitHub` 身份；
- 用户被 `GitHub` 重定向回您的站点；
- 您的应用程序使用用户的访问令牌访问 `API`；

`OAuth2.0` 授权码模式的授权流程：
如果 `fire` 网站允许 用 `GitHub` 账号登录，流程大致如下图。

![](./images/01_授权流程.png)

流程描述：
用户想用 `GitHub` 账号去登录 `fire` 网站：

- `fire` 网站先让用户跳转到 `GitHub` 进行授权，会弹出一个授权框。
- 用户同意后，`GitHub` 会根据 `redirect_uri` 重定向回 `fire` 网站，同时返回一个授权码 `code`。
- `fire` 网站使用授权码 `code` 和客户端密钥 `client_secret`，向 `GitHub` 请求令牌 `token`，检验通过返回令牌。
- 最后 `fire` 网站向 `GitHub` 请求数据，每次调用 `GitHub` 的 `API` 都要带上令牌。

## 2. 注册应用

要想得到一个网站的 `OAuth` 授权，必须要到它的网站进行身份注册，拿到应用的身份识别码 `ClientID` 和 `ClientSecret`。
[注册传送门](https://github.com/settings/applications/new)，有几个必填项。

- `Application name`：我们的应用名；
- `Homepage URL`：应用主页链接；
- `Authorization callback URL`：这个是 `github` 回调我们项目的地址，用来获取授权码和令牌。

OAuth 应用注册入口：

![](./images/02_OAuth应用注册入口.png)

注册 OAuth 应用：

![](./images/03_注册应用.png)

新增成功：

![](./images/04_新增应用.png)

生成客户端密钥：

![](./images/05_生成客户端密钥.png)

这个时候需要本地保存这个客户端密钥，再次访问会不可见：

![](./images/06_重新访问客户端密钥不可见.png)

## 3. 授权开发

### 3.1 获取授权码

我们请求 `https://github.com/login/oauth/authorize?client_id=${yourclient_id}&redirect_uri=${your_redirect_url/authorize}`：

请求后会提示让我们授权，同意授权后会重定向到 `authorize/redirect`，并携带授权码 `code`；
如果之前已经同意过，会跳过这一步直接回调。

然后我就回跳转到 `redirect_url`，能拿到这个 `code`。

可以直接访问这个链接 `https://github.com/login/oauth/authorize?client_id=Ov23li2YjzLKLnY9UM1P&redirect_uri=http://localhost:8080/api/auth` 验证看看：

![](./images/07_手动访问Github授权链接.png)

授权后，就回跳转到 `redirect_url`，能拿到这个 `code`：

```
http://localhost:8080/api/auth?code=2e0eb8acd2ce64836cde
```

代码实现：

```bash
go mod init github_oauth_backend_demo
# go: creating new go.mod: module github_oauth_backend_demo
```

```go
package main

import (
	"log"
	"net/http"
	"net/url"
)

const (
	clientID     = "*****"                     // 确保与 GitHub 应用信息一致
	clientSecret = "*****" // 确保与 GitHub 应用信息一致
	redirectURI  = "http://localhost:8080/api/auth"           // 确保与 GitHub 应用配置一致
)

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

func main() {
	http.HandleFunc("/login", loginHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

执行：

```go
go run main.go
```

看下效果：

浏览器访问 `http://localhost:8080/login` 后，`Github` 应用授权后，会自动重定向到 `http://localhost:8080/api/auth?code=f1393afad0ba0219b714`。

### 3.2 获取令牌

想获取 `access_token`，我们需要向这个 `https://github.com/login/oauth/access_token` 发送 `post` 请求，携带 `client_id`,`client_secret`,`code` 参数，`access_token` 会作为请求响应返回。

代码实现：

```go

func _exchangeCodeForAccessToken(code string) (string, error) {
	tokenURL := "https://github.com/login/oauth/access_token"
	resp, err := http.PostForm(tokenURL, url.Values{
		"client_id":     {clientID},
		"client_secret": {clientSecret},
		"code":          {code},
		"redirect_uri":  {redirectURI},
	})
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to get access token, status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// Print the raw response for debugging purposes
	fmt.Printf("Token exchange response: %s\n", string(body))

	// Parse the response to extract the access token
	values, err := url.ParseQuery(string(body))
	if err != nil {
		return "", err
	}
	accessToken := values.Get("access_token")
	if accessToken == "" {
		return "", fmt.Errorf("access_token not found in response")
	}
	return accessToken, nil
}
```

### 3.3 获取用户信息

```go
func _getUserInfo(accessToken string) (string, error) {
	userURL := "https://api.github.com/user"
	req, err := http.NewRequest("GET", userURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", "Bearer "+accessToken)
	req.Header.Add("User-Agent", "Go OAuth App") // GitHub API requires a User-Agent header

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}
```

## 4. 看下效果

浏览器访问 `http://localhost:8080/login` 后，重定向到 `http://localhost:8080/api/auth?code=7a832d8154b5ac1cf87b`，响应内容：

```
User Info: {"login":"ocean-gao","id":73287541,"node_id":"MDQ6VXNlcjczMjg3NTQx",...,"created_at":"2020-10-22T11:21:29Z","updated_at":"2024-10-15T16:31:12Z"}
```

`json` 格式化下：

```json
{
    "login": "ocean-gao",
    "id": 73287541,
    "node_id": "MDQ6VXNlcjczMjg3NTQx",
    "avatar_url": "https://avatars.githubusercontent.com/u/73287541?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/ocean-gao",
    "html_url": "https://github.com/ocean-gao",
    "followers_url": "https://api.github.com/users/ocean-gao/followers",
    "following_url": "https://api.github.com/users/ocean-gao/following{/other_user}",
    "gists_url": "https://api.github.com/users/ocean-gao/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/ocean-gao/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/ocean-gao/subscriptions",
    "organizations_url": "https://api.github.com/users/ocean-gao/orgs",
    "repos_url": "https://api.github.com/users/ocean-gao/repos",
    "events_url": "https://api.github.com/users/ocean-gao/events{/privacy}",
    "received_events_url": "https://api.github.com/users/ocean-gao/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "ocean_gao",
    "company": null,
    "blog": "",
    "location": null,
    "email": "*****",
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "notification_email": "*****",
    "public_repos": 32,
    "public_gists": 0,
    "followers": 1,
    "following": 7,
    "created_at": "2020-10-22T11:21:29Z",
    "updated_at": "2024-10-15T16:31:12Z"
}
```

## 5. 封装到应用程序

```go
package open_login

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const (
	tokenURL  = "https://github.com/login/oauth/access_token"
	userURL   = "https://api.github.com/user"
	userAgent = "Go OAuth App" // GitHub API requires a User-Agent header
)

type GithubInfo struct {
	Name        string `json:"name"`       // 昵称
	Avatar      string `json:"avatar_url"` // 头像
	AccessToken string `json:"accesstoken"`
}

type GithubLogin struct {
	clientID     string
	clientSecret string
	redirectURI  string
	code         string
	AccessToken  string
}

type GithubConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

func NewGithubLogin(code string, conf GithubConfig) (githubInfo GithubInfo, err error) {
	githubLogin := &GithubLogin{
		clientID:     conf.ClientID,
		clientSecret: conf.ClientSecret,
		redirectURI:  conf.RedirectURI,
		code:         code,
	}
	err = githubLogin.GetAccessToken()
	if err != nil {
		return githubInfo, err
	}
	githubInfo, err = githubLogin.GetUserInfo()
	if err != nil {
		return githubInfo, err
	}
	githubInfo.AccessToken = githubLogin.AccessToken
	return githubInfo, nil

}

// GetAccessToken exchanges the authorization code for an access token
func (g *GithubLogin) GetAccessToken() error {
	resp, err := http.PostForm(tokenURL, url.Values{
		"client_id":     {g.clientID},
		"client_secret": {g.clientSecret},
		"code":          {g.code},
		"redirect_uri":  {g.redirectURI},
	})
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to get access token, status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// Parse the response to extract the access token
	values, err := url.ParseQuery(string(body))
	if err != nil {
		return err
	}
	g.AccessToken = values.Get("access_token")
	if g.AccessToken == "" {
		return fmt.Errorf("access_token not found in response")
	}
	return nil
}

func (g *GithubLogin) GetUserInfo() (GithubInfo, error) {
	req, err := http.NewRequest("GET", userURL, nil)
	if err != nil {
		return GithubInfo{}, err
	}

	req.Header.Add("Authorization", "Bearer "+g.AccessToken)
	req.Header.Add("User-Agent", userAgent) // GitHub API requires a User-Agent header

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return GithubInfo{}, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return GithubInfo{}, fmt.Errorf("failed to get user info, status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return GithubInfo{}, err
	}

	var githubInfo GithubInfo
	if err := json.Unmarshal(body, &githubInfo); err != nil {
		return GithubInfo{}, err
	}
	return githubInfo, nil
}
```

请求 `http://localhost:8080/login` 重定向到 `http://localhost:8080/api/auth?code=7a832d8154b5ac1cf87b`，响应内容为：

```
{ocean_gao https://avatars.githubusercontent.com/u/73287541?v=4 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}
```

## 6. 参考

- [用 Go 简单实现 Github 授权登录并获取 github 用户信息](https://juejin.cn/post/7414732978141544463)
- [没错，用三方 Github 做授权登录就是这么简单！（OAuth2.0 实战）](https://cloud.tencent.com/developer/article/1663102)
- [一口气说出 OAuth2.0 的四种授权方式](https://mp.weixin.qq.com/s?__biz=MzAxNTM4NzAyNg==&mid=2247487003&idx=1&sn=47cd6b064a7fc3b3df8f6f4c3f7669a7)
- [理解 OAuth 2.0 - 阮一峰](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
- [Github 文档 - 授权 OAuth 应用](https://docs.github.com/zh/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
