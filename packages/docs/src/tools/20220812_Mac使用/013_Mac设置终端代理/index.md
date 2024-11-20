# MAC 设置终端代理

```bash
vi ~/.zshrc
```

增加以下配置内容：

```bash
# 设置终端代理
alias add_proxy="export https_proxy=http://127.0.0.1:7890;http_proxy=http://127.0.0.1:7890;all_proxy=socks5://127.0.0.1:7890"
# 取消终端代理
alias un_proxy="unset https_proxy http_proxy all_proxy"
```

查看配置：

```bash
cat ~/.zshrc

# # 设置终端代理
# alias add_proxy="export https_proxy=http://127.0.0.1:7890;http_proxy=http://127.0.0.1:7890;all_proxy=socks5://127.0.0.1:7890"
# # 取消终端代理
# alias un_proxy="unset https_proxy http_proxy all_proxy"
```

配置生效：

```bash
source ~/.zshrc
```

验证：

```bash
curl https://registry.npmjs.org/
# {}

# 或
curl https://www.google.com/
```
