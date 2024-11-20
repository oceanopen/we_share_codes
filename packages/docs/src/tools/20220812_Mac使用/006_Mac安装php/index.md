# Mac 安装 php

## 1. HomeBrew 安装

```bash
brew search php
# ==> Formulae
# brew-php-switcher    php-code-sniffer     php-cs-fixer@2       php@8.0              phpbrew              phpmd                phpstan              pcp
# php                  php-cs-fixer         php@7.4              php@8.1              phplint              phpmyadmin           phpunit              pup

# ==> Casks
# eclipse-php                                phpstorm                                   phpwebstudy                                pop

brew install php@8.1
# ...
# Finally, check DirectoryIndex includes index.php
#     DirectoryIndex index.php index.html

# The php.ini and php-fpm.ini file can be found in:
#     /usr/local/etc/php/8.1/

# php@8.1 is keg-only, which means it was not symlinked into /usr/local,
# because this is an alternate version of another formula.

# If you need to have php@8.1 first in your PATH, run:
#   echo 'export PATH="/usr/local/opt/php@8.1/bin:$PATH"' >> ~/.zshrc
#   echo 'export PATH="/usr/local/opt/php@8.1/sbin:$PATH"' >> ~/.zshrc

# For compilers to find php@8.1 you may need to set:
#   export LDFLAGS="-L/usr/local/opt/php@8.1/lib"
#   export CPPFLAGS="-I/usr/local/opt/php@8.1/include"

# To start php@8.1 now and restart at login:
#   brew services start php@8.1
# Or, if you don't want/need a background service you can just run:
#   /usr/local/opt/php@8.1/sbin/php-fpm --nodaemonize
```

## 2. 设置环境变量

编辑 `~/.bash_profile`，添加以下配置：

```bash
# ------------ php start -----------
export PATH="/usr/local/opt/php@8.1/bin:$PATH"
export PATH="/usr/local/opt/php@8.1/sbin:$PATH"
# ------------ php end   -----------
```

如果 `~/.zshrc` 未配置 `~/.bash_profile` 自动生效，则需要添加配置：

```shell
# 配置shell环境用户环境变量生效
source ~/.bash_profile
```

## 3. 安装测试

```bash
php -v
# PHP 8.1.20 (cli) (built: Jun 15 2023 05:42:11) (NTS)
# Copyright (c) The PHP Group
# Zend Engine v4.1.20, Copyright (c) Zend Technologies
#     with Zend OPcache v8.1.20, Copyright (c), by Zend Technologies
```
