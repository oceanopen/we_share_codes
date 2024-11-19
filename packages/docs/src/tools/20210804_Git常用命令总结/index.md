# Git 常用命令总结

![](./images/001_封面.png)

> 名词介绍：

![](./images/002_操作流程.png)

- Workspace：工作区
- Index/Stage：暂存区，也叫索引
- Repository：仓库区（或本地仓库），也存储库
- Remote：远程仓库

## 1. Git 配置

### 1.1 全局配置

```bash
# 查看全局配置信息
git config --global --list

# 全局用户信息配置
git config --global user.name [name]
git config --global user.email [email]

# 清除配置的用户名和邮箱(假如全局配置信息里面有设置的用户名和邮箱信息的话)
git config --global --unset user.name
git config --global --unset user.email
```

### 1.2 项目配置

```bash
# 查看项目配置信息
git config --local --list

# 项目用户信息配置
git config --local user.name [name]
git config --local user.email [email]

# 清除配置的用户名和邮箱(假如项目配置信息里面有设置的用户名和邮箱信息的话)
git config --local --unset user.name
git config --local --unset user.email
```

## 2. 常用命令

```bash
# 根据用户名和密码拉取Git仓库
git clone https://[用户名]:[用户密码]@gitee.com/[git项目路径]

# 查看当前 git 状态，显示 untracked 文件及修改文件
git status

# 清除当前目录下，未提交的文件
git clean -n # 显示当前目录下待清除的文件
git clean -f # 清除当前目录下的未提交的文件

# 查看分支
git branch -a # 查看所有本地分支和远程分支
git branch -r # 只查看远程分支
git remote show origin # 查看本地分支与远程分支对应关系

# 删除分支
git branch -D [分支名] # 删除本地分支
git remote prune origin # 删除本地一些远程仓库已经不存在的分支

# 查看当前项目仓库地址
git remote -v

# 设置新的仓库地址
git remote set-url origin [git仓库地址]

# 根据远程分支自动创建本地关联分支
git checkout -t origin/[远程分支名]
```

### 2.1 创建 SSH Key

```bash
ssh-keygen -t rsa -C "youremail@example.com"
```

### 2.2 仓库

```bash
# 在当前目录新建一个 Git 代码库
git init

# 新建一个目录，将其初始化为 Git 代码库
git init [project-name]

# 下载一个项目和它的整个代码历史
git clone [url]
```

### 2.3 增加/删除文件

```bash
# 添加指定文件到暂存区
git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
git add [dir]

# 添加当前目录的所有文件到暂存区
git add .

# 添加每个变化前，都会要求确认
# 对于暂存区和工作区中同一个文件的多处变化，可以实现分次提交
git add -p

# 删除暂存区文件，且该文件不会保留在工作区
git rm -f [file1] [file2] ...

# 暂存区删除文件，但该文件会保留在工作区
git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
git mv [file-original] [file-renamed]
```

### 2.4 代码提交

```bash
# 提交暂存区到仓库区
git commit -m [message]

# 提交暂存区的指定文件到仓库区
git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
git commit -a

# 提交时显示所有 diff 信息
git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次 commit 的提交信息
git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
git commit --amend [file1] [file2] ...
```

### 2.5 分支

```bash
# 列出所有本地分支
git branch

# 列出所有远程分支
git branch -r

# 列出所有本地分支和远程分支
git branch -a

# 新建一个分支，但依然停留在当前分支
git branch [branch-name]

# 新建一个分支，并切换到该分支
git checkout -b [branch]

# 新建一个分支，指向指定commit
git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
git checkout [branch-name]

# 切换到上一个分支
git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
git branch --set-upstream [branch] [remote-branch]

# 把指定的分支合并到当前所在的分支下，并自动进行新的提交
git merge [branch]

# 把指定的分支合并到当前所在的分支下，不进行新的提交
git merge --no-commit [分支名称]

# 选择一个 commit ，合并进当前分支
git cherry-pick [commit]

# 删除分支
git branch -d [branch-name]

# 删除远程分支
git push [远程仓库的别名] :[远程分支名]
git push [远程仓库的别名] --delete [远程分支名]
git branch -dr [remote/branch]
```

### 2.6 标签

```bash
# 列出所有 tag
git tag

# 新建一个 tag 在当前 commit
git tag [tag]

# 新建一个 tag 在指定 commit
git tag [tag] [commit]

# 删除本地 tag
git tag -d [tag]

# 删除远程 tag
git push origin refs/tags/[tagName]

# 查看 tag 信息
git show [tag]

# 提交指定 tag
git push [remote] [tag]

# 提交所有 tag
git push [remote] --tags

# 新建一个分支，指向某个 tag
git checkout -b [branch] [tag]
```

### 2.7 查看信息

```bash
# 显示有变更的文件
git status

# 显示当前分支的版本历史
git log

# 显示 commit 历史，以及每次 commit 发生变更的文件
git log --stat

# 搜索提交历史，根据关键词
git log -S [keyword]

# 显示某个 commit 之后的所有变动，每个 commit 占据一行
git log [tag] HEAD --pretty=format:%s

# 显示某个 commit 之后的所有变动，其"提交说明"必须符合搜索条件
git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
git log --follow [file]
git whatchanged [file]

# 显示指定文件相关的每一次 diff
git log -p [file]

# 显示过去5次提交
git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
git blame [file]

# 显示暂存区和工作区的差异
git diff

# 显示暂存区和上一个 commit 的差异
git diff --cached [file]
git diff --staged [file]

# 显示工作区与当前分支最新 commit 之间的差异
git diff HEAD

# 显示两次提交之间的差异
git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
git show [commit]

# 显示某次提交发生变化的文件
git show --name-only [commit]

# 显示某次提交时，某个文件的内容
git show [commit]:[filename]

# 显示当前分支的最近几次提交
git reflog
```

### 2.8 远程同步

```bash
# 下载远程仓库的所有变动
git fetch [remote]

# 显示所有远程仓库
git remote -v
git remote --verbose

# 显示某个远程仓库的信息
git remote show [remote]

# 增加一个新的远程仓库，并命名
git remote add [shortname] [url]

# 修改远程仓库的别名
git remote rename [原远程仓库的别名] [新的别名]

# 删除指定名称的远程仓库
git remote remove [远程仓库的别名]

# 修改远程仓库的 URL 地址
git remote set-url [远程仓库的别名] [新的远程仓库URL地址]

# 取回远程仓库的变化，并与本地分支合并
git pull [remote] [branch]

# 上传本地指定分支到远程仓库
git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
git push [remote] --force

# 推送所有分支到远程仓库
git push [remote] --all
```

### 2.9 撤销

```bash
# 恢复暂存区的指定文件到工作区
git checkout [file]

# 恢复某个 commit 的指定文件到暂存区和工作区
git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
git checkout .

# 重置暂存区的指定文件，与上一次 commit 保持一致，但工作区不变
git reset [file]

# 重置暂存区与工作区，与上一次 commit 保持一致
git reset --hard

# 重置当前分支的指针为指定 commit，同时重置暂存区，但工作区不变
git reset [commit]

# 重置当前分支的 HEAD 为指定 commit，同时重置暂存区和工作区，与指定 commit 一致
git reset --hard [commit]

# 重置当前 HEAD 为指定 commit，但保持暂存区和工作区不变
git reset --keep [commit]

# 新建一个 commit，用来撤销指定 commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
git stash
git stash pop
```

## 3. 常见操作

### 3.1 Git 修改已经提交的用户名信息

How to change the committer name and e-mail of multiple commits in Git?

1. 配置本地用户名和邮箱

```bash
git config --local user.name [name]
git config --local user.email [email]
```

2. 确认修改信息

```bash
git rebase -i [commit-sha] --exec 'git commit --amend --reset-author --no-edit'
```

> `commit-sha` ，即 `commit SHA` ，确定提交记录之后的修改范围。

```
pick b039e36 refactor: 增加链接
exec git commit --amend --reset-author --no-edit

...
```

通过`:wq`保存。

3. 提交到 `origin/<branch-name>`

```bash
git push --force --tags origin HEAD:[branch-name]
```

这个时候，远程分支就已经改过了。但本地操作还没执行完，继续执行。

4. 本地分支同步

```bash
rm -rf ".git/rebase-merge"
git checkout origin/[branch-name] && git checkout [branch-name]
```

这个时候会提示本地分支和远程分支不一致：

```
Switched to branch '<branch-name>'
Your branch and 'origin/<branch-name>' have diverged,
and have 7 and 2 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)
```

执行本地分支和远程分支一致：

```bash
git reset --hard origin/[branch-name]
```
