# Mac 手动更新 oh-my-zsh

## 1. 提示升级

```bash
# Last login: Fri Oct 11 00:34:18 on ttys001
# [oh-my-zsh] Would you like to update? [Y/n] y
# Updating Oh My Zsh
# fatal: unable to access 'https://github.com/ohmyzsh/ohmyzsh.git/': Failure when receiving data from the peer
# There was an error updating. Try again later?
```

如果出现上面的升级提示，升级失败，比如需要先设置代理才能升级，那么就需要手动升级。

## 2. 终端代理

需要先设置终端代理：

```bash
cat ~/.zshrc

# ...
# 设置终端代理
# alias add_proxy="export https_proxy=http://127.0.0.1:7890;http_proxy=http://127.0.0.1:7890;all_proxy=socks5://127.0.0.1:7890"
# 取消终端代理
# alias un_proxy="unset https_proxy http_proxy all_proxy"
# ...
```

开启终端代理：

```bash
add_proxy
```

验证代理：

```bash
curl https://google.com
# <HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
# <TITLE>301 Moved</TITLE></HEAD><BODY>
# <H1>301 Moved</H1>
# The document has moved
# <A HREF="https://www.google.com/">here</A>.
# </BODY></HTML>

# 或者
curl https://registry.npmjs.org/
# {}
```

## 3. 手动更新

安装完 `oh-my-zsh` 后，会有 `omz` 命令：

```bash
omz version
# master (d2d5155)
```

那么就可以通过这个命令手动更新：

```bash
omz update
```

或者:

```bash
cd ~/.oh-my-zsh/tools
zsh upgrade.sh
```

升级成功提示：

```bash
omz update
# Updating Oh My Zsh
# You can see the changelog with `omz changelog`
#          __                                     __
#   ____  / /_     ____ ___  __  __   ____  _____/ /_
#  / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \
# / /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
# \____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/
#                         /____/

# Hooray! Oh My Zsh has been updated!

# To keep up with the latest news and updates, follow us on X: @ohmyzsh
# Want to get involved in the community? Join our Discord: Discord server
# Get your Oh My Zsh swag at: Planet Argon Shop
```
