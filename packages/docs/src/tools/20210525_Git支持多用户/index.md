# Git 支持多用户

> 本文以 gitee 为例 支持多用户的配置。

## 1. 用户配置

> 全局配置查看，即项目默认用户配置

```bash
# 查看全局配置信息
git config --global --list

# 全局用户信息配置
git config --global user.name
git config --global user.email

# 清除配置的用户名和邮箱(假如全局配置信息里面有设置的用户名和邮箱信息的话)
git config --global --unset user.name
git config --global --unset user.email
```

> 当前项目配置

```bash
# 查看项目配置信息
git config --local --list
```

## 2. ssh 配置

不同的 git 服务器需要不同的 ssh 配置。

> 也可以通过用户名密码的方式访问 git 仓库：

```bash
cd git_project_dir
git clone https://[用户名]:[用户密码]@gitee.com/[git项目路径]
```

但这种方式会导致密码明文暴露，所以推荐 `ssh` 方式访问。

### 2.1 创建 ssh 秘钥对

```bash
# 生成 gitee 专用秘钥对
ssh-keygen -t rsa -C 'xxx@test.com' -f ~/.ssh/id_rsa_gitee
```

> `xxx@test.com` 为 用户邮箱；
> `-f ~/.ssh/id_rsa_gitee` 为专用秘钥文件名；默认文件名为 `id_rsa`，一般用于全局配置；

执行后，会创建两个秘钥文件：

```bash
ll | grep id_rsa_gitee
# id_rsa_gitee # 私钥，本地保存
# id_rsa_gitee.pub # 公钥，服务器保存
```

配置公钥信息：

- 在网站的 `SSH` 秘钥管理页面新增我们刚才创建好的公钥信息，这里不在赘述。

### 2.2 增加 ssh 访问配置

在 `~/.ssh` 目录下编辑 `config` 文件，添加如下内容：

```
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_gitee
```

### 2.3 测试验证

```bash
ssh -T git@gitee.com
# Hi [用户名]! You've successfully authenticated, but GITEE.COM does not provide shell access.
```

## 3. 项目用户配置

进入本地的 git 项目目录，执行以下命令：

```bash
# 配置仓库级别用户名和邮箱
git config --local user.name "xxxx"
git config --local user.email "xxx@test.com"

# 验证
git config --local --list
```
