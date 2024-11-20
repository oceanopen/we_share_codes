# Mac 设置环境变量 PATH 和查看 PATH

## 1. 配置文件

`Mac` 系统的环境变量，加载顺序为：

```
/etc/profile
/etc/paths

~/.bash_profile
~/.bash_login
~/.profile

~/.bashrc
```

`/etc/profile` 和 `/etc/paths` 是系统级别的，系统启动就会加载，后面几个是当前用户级的环境变量。

后面 `3` 个按照从前往后的顺序读取，如果 `~/.bash_profile` 文件存在，则后面的几个文件就会被忽略不读了，如果 `~/.bash_profile` 文件不存在，才会以此类推读取后面的文件。

`~/.bashrc` 没有上述规则，它是 `bash shell` 打开的时候载入的。

## 2. PATH 语法

```bash
# 中间用冒号隔开
export PATH=$PATH:<PATH 1>:<PATH 2>:<PATH 3>:------:<PATH N>
```

## 3. 配置文件介绍

### 3.1 `/etc/paths`

> 全局建议修改这个文件。

编辑 `paths`，将环境变量添加到 `paths` 文件中，一行一个路径。
注：输入环境变量时，不用一个一个地输入，只要拖动文件夹到 `Terminal` 里就可以了。

```bash
cat /etc/paths
# /usr/local/bin
# /System/Cryptexes/App/usr/bin
# /usr/bin
# /bin
# /usr/sbin
# /sbin
```

### 3.2 `/etc/profile`

> 建议不修改这个文件。

> 使用注意：如果你有对 `/etc/profile` 有修改的话必须得 `重启` 你的修改才会生效，此修改对每个用户都生效。

全局（公有）配置，不管是哪个用户，登录时都会读取该文件。

### 3.3 `/etc/bashrc`

> 一般在这个文件中添加 `系统级` 环境变量。

全局（公有）配置，`bash shell` 执行时，不管是何种方式，都会读取此文件。

### 3.4 `~/.profile`

> 文件为系统的 `每个用户` 设置环境信息，当用户第一次登录时，该文件被执行。

并从 `/etc/profile.d` 目录的配置文件中搜集 `shell` 的设置。

需要执行以下命令才会对当前用户生效：

```bash
source ~/.profile
```

### 3.5 `~/.bashrc`

> 每一个运行 `bash shell` 的用户执行此文件。当 `bash shell` 被打开时，该文件被读取。

> 使用注意：对所有的使用 `bash` 的用户修改某个配置并在以后打开的 `bash` 都生效的话可以修改这个文件，修改这个文件不用重启，重新打开一个 `bash` 即可生效。

### 3.6 `~/.bash_profile`

> 该文件包含专用于你的 `bash shell` 的 `bash` 信息，当登录时以及每次打开新的 `shell` 时,该文件被读取。
> 每个用户都有一个 `.bashrc` 文件，在用户目录下。

> 使用注意：`/etc/profile` 对所有用户生效，`~/.bash_profile` 只对当前用户生效。

需要执行以下命令才会对当前用户生效：

```bash
source ~/.bash_profile
```

### 4. 全局设置

#### 4.1 创建一个文件

```bash
sudo touch /etc/paths.d/mysql
```

#### 4.2 用 `vim` 打开这个文件

```bash
sudo vim /etc/paths.d/mysql
```

#### 4.3 编辑该文件

> 键入路径并保存（关闭该 `Terminal` 窗口并重新打开一个，就能使用 `mysql` 命令了）。

```shell
/usr/local/mysql/bin
```

#### 4.4 环境配置生效

```bash
source /etc/paths.d/mysql
```

### 5. 单个用户设置

#### 5.1 进入用户主目录

```bash
cd ~
touch .bash_profile # 默认没有此文件，需要新建
```

#### 5.2 编辑 `.bash_profile`

```bash
sudo vim .bash_profile
```

文件内容：

```shell
export PATH=/opt/local/bin:/opt/local/sbin:$PATH
```

#### 5.3 配置文件生效

```bash
source ~/.bash_profile
```

### 6. 查看 PATH

```bash
echo $PATH
# /opt/local/bin:/opt/local/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin
```
