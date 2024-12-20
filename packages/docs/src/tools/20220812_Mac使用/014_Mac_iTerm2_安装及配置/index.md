# Mac iTerm2 安装及配置

## 1. zsh 介绍

`zsh` 是一个兼容 `bash` 的 `shell`，相较系统原本的 `bash` 具有以下优点：

- `Tab` 补全功能强大。命令、命令参数、文件路径均可以补全。
- 插件丰富。快速输入以前使用过的命令、快速跳转文件夹、显示系统负载这些都可以通过插件实现。
- 主题丰富，可定制性高。

## 2. zsh、iterm2、oh-my-zsh 是什么关系

- `zsh` 是 `终端(Shell)` 的一种，常用的 `Shell` 有 `zsh`、`bash`、`csh` 等，一般电脑默认终端是 `bash`，打开终端，通过
  `cat /etc/shells` 查看自己有几个 `shell`。

```bash
cat /etc/shells
# # List of acceptable shells for chpass(1).
# # Ftpd will not allow users to connect who are not using
# # one of these shells.

# /bin/bash
# /bin/csh
# /bin/dash
# /bin/ksh
# /bin/sh
# /bin/tcsh
# /bin/zsh
```

- 默认的 `zsh` 配置有点麻烦。因此有用户在 `GitHub` 上制作了一个配置文件 `oh-my-zsh`，这是目前为止最流行的 `zsh` `配置，说白了oh-my-zsh` 就是一个人做的 `zsh` 的配置文件，因为配置起来很方便，所以现在几乎成为标配。

  - [Github](https://github.com/ohmyzsh/ohmyzsh)
  - [官网](https://ohmyz.sh/)

- `iterm2` 这是一个终端模拟器，是个 `app`，只不过它的作用是模拟终端。

## 3. iTerm2 安装

`iterm2` 可以用来替换掉默认终端。[官网下载](https://iterm2.com/)。

## 4. 将 shell 设置为 zsh

系统提供了很多 `shell`，默认的 `shell` 格式为 `/bin/bash` 格式。可通过 `echo $SHELL` 查看当前的 `shell` 格式。

```bash
echo $SHELL
# /bin/zsh
```

查看系统支持的所有 `shell` 格式：

```bash
cat /etc/shells
# # List of acceptable shells for chpass(1).
# # Ftpd will not allow users to connect who are not using
# # one of these shells.

# /bin/bash
# /bin/csh
# /bin/dash
# /bin/ksh
# /bin/sh
# /bin/tcsh
# /bin/zsh
```

将当前的 `shell` 设置为 `/bin/zsh` 格式:

```bash
chsh -s /bin/zsh
```

## 5. oh-my-zsh 插件安装

`Oh My Zsh` 是一个开源的，社区驱动框架，用来管理 `zsh`。[Github](https://github.com/ohmyzsh/ohmyzsh)。

使用 `curl` 安装:

```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

使用 `wget` 安装:

```bash
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

## 6. 配置 `oh-my-zsh` 主题

```bash
cat ~/.zshrc
# # Set name of the theme to load --- if set to "random", it will
# # load a random theme each time oh-my-zsh is loaded, in which case,
# # to know which specific one was loaded, run: echo $RANDOM_THEME
# # See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
# # ZSH_THEME="robbyrussell"
# ZSH_THEME="ys"
```

这里配置的是 `ys` 主题，这个主题是可以不用下载特殊字体的，直接改 `ZSH_THEME="ys"` 就可以。

然后，执行 `source ~/.zshrc` 配置生效。

## 7. 配置插件

在 `$ZSH/plugins/` 目录中提供了很多的插件。

```bash
cd $ZSH/plugins
ll
# ...
# drwxr-xr-x@  4 [username]  staff   128B 10 13 19:01 git
# drwxr-xr-x@  8 [username]  staff   256B  4 13  2024 z
# ...
```

或者:

```bash
ls $ZSH/plugins
```

这些插件主要可以提供快捷键等功能。

每个插件的目录下有一个 `READMD.md` 文件，里面详细介绍了插件的使用。

用 `vim` 打开 `.zshrc` 文件，找到插件设置命令，默认是 `plugins=(git)`，若要增加插件 `z`, 则我们可以把它修改为:

```ini
plugins=(git z) # 插件之间使用空格隔开
```

## 8. 配置命令高亮

默认情况下，系统命令都是以白色显示。为了与内容区分开来，可以安装下面的插件，安装完成之后`pwd`、`ls` 等系统命令都会以高亮显示。

1. 把插件下载到本地的 `~/.oh-my-zsh/custom/plugins` 目录:

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting
```

2. 在 `.zshrc` 中，把 `zsh-autosuggestions` 加入插件列表：

```ini
plugins=(
    # other plugins...
    zsh-autosuggestions
)
```

3. 执行 `source ~/.zshrc` 使配置生效。

## 9. 配置命令补全

普通的命令补全需要按 `2` 下`【tab】`键，安装了补齐插件之后，系统会自动显示补全命令。

[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 是一个命令提示插件，当你输入命令时，会自动推测你可能需要输入的命令，按下右键可以快速采用建议。

1. 把插件下载到本地的 `~/.oh-my-zsh/custom/plugins` 目录：

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM}/plugins/zsh-autosuggestions
```

2. 在 `.zshrc` 中，把 `zsh-autosuggestions` 加入插件列表：

```ini
plugins=(
    # other plugins...
    zsh-autosuggestions  # 插件之间使用空格隔开
    zsh-syntax-highlighting
)
```

3. 执行 `source ~/.zshrc` 使配置生效。

## 10. 配置文件夹快捷跳转

`z` 是一个文件夹快捷跳转插件，对于曾经跳转过的目录，只需要输入最终目标文件夹名称，就可以快速跳转，避免再输入长串路径，提高切换文件夹的效率。

效果如下：

```bash
cd ~/Project/we_share_codes
pwd
# /Users/[username]/Project/we_share_codes

$ cd ~
$ z we_share_codes
$ pwd
# /Users/[username]/Project/we_share_codes
```

由于 `oh-my-zsh` 内置了 `z` 插件，所以只需要在 `.zshrc` 中，把 `z` 加入插件列表：

```ini
plugins=(
     # other plugins...
     zsh-autosuggestions
     zsh-syntax-highlighting
     z
)
```

然后，开启新的 `Shell` 或执行 `source ~/.zshrc`，就可以开始体验插件了。

## 11. 手动更新 oh-my-zsh

### 11.1 提示升级

```bash
# Last login: Fri Oct 11 00:34:18 on ttys001
# [oh-my-zsh] Would you like to update? [Y/n] y
# Updating Oh My Zsh
# fatal: unable to access 'https://github.com/ohmyzsh/ohmyzsh.git/': Failure when receiving data from the peer
# There was an error updating. Try again later?
```

如果出现上面的升级提示，升级失败，比如需要先设置代理才能升级，那么就需要手动升级。

### 11.2 终端代理

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

### 11.3 手动更新

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

## 12. 参考

- [安装oh-my-zsh，配置命令行高亮，命令提示，打造高效终端](https://blog.csdn.net/a143730/article/details/135573409)
