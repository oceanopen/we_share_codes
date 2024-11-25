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
