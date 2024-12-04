# Git 如何同步本地、远程的分支和 tag 信息

## 1. Git 如何同步本地分支与远程 origin 的分支

### 1.1 本地删除远程不存在的分支

#### 1.1.1 问题场景

1. `同事 A` 创建了 `本地分支 branchA` 并 `push` 到了远程
2. `同事 B` 在 `本地拉取(git fetch)` 了和 `远程 branchA` 同步的`本地分支 branchA`
3. `同事 A` 开发完成将 `远程分支 branchA` 删除（远程仓库已经不存在 `分支 branchA`）
4. `同事 B` 用 `git fetch` 同步远端分支, `git branch -r` 发现本地仍然记录有 `branchA` 的远程分支

#### 1.1.2 分析

远端有新增分支，`git fetch` 可以同步到新的分支到本地，但是远端有删除分支，直接 `git fetch` 是不能将远程已经不存在的 `branch` 等在本地删除的。

#### 1.1.3 解决方法

```bash
git fetch origin --prune            # 这样就可以实现在本地删除远程已经不存在的分支
# 或者简略为:
git fetch origin -p
git fetch --prune
git fetch -p
git remote prune origin
```

`branch` 常用的命令:

```bash
git branch -a                       # 查看本地和远程所有的分支
git branch -r                       # 查看所有远程分支
git branch                          # 查看所有本地分支
git branch -d -r origin/branchA     # 删除远程分支
```

其他较常用的命令:

```bash
git fetch                                   # 将本地分支与远程保持同步
git checkout -b 本地分支名 origin/远程分支名   # 拉取远程分支并同时创建对应的本地分支
git checkout -t origin/远程分支名            # 拉取远程分支并自动创建本地分支
```

### 1.2 本地与远程分支保持同步

#### 1.2.1 问题场景

本地分支提示：`Git Your branch is ahead of ‘origin/master’ by X commits`。
你想让本地直接和远程保持同步，想让不再提示这个信息。

#### 1.2.2 解决办法

那么如果你本地的 `commit` 确保不想要，可以如下操作:

```bash
git reset --hard origin/master
```

或者还有一个将本地代码与服务器代码更新一致的语句:

```bash
git branch -u origin/master
```

如果想直接回退版本让远程和本地代码保持一致，那就确保本地代码没问题之后强制推到远程:

```bash
git push -f origin master
```

## 2. Git 如何同步本地 tag 与远程 tag

### 2.1 问题场景

1. `同事 A` 在本地创建 `tagA` 并 `push` 同步到了远程
2. `同事 B` 在本地拉取了 `远程 tagA(git fetch)`
3. `同事 A` 工作需要将 `远程标签tagA删除`
4. `同事 B` 用 `git fetch` 同步远端信息，`git tag` 发现本地仍然记录有 `tagA`

### 2.2 分析

对于 `远程 repository` 中已经删除了的 `tag`，即使使用 `git fetch --prune`，甚至 `git fetch --tags` 确保下载所有 `tags`，也不会让其在本地也将其删除的。
而且，似乎 `git` 目前也没有提供一个直接的命令和参数选项可以删除本地的在远程已经不存在的 `tag`。

### 2.3 解决方法

```bash
git tag -l | xargs git tag -d   # 删除所有本地分支
git fetch origin --prune        # 从远程拉取所有信息
```

查询远程tags的命令如下:

```bash
git ls-remote --tags origin
```

`tag` 常用 `git` 命令:

```bash
git tag                             # 列出所有 tag
git tag -l v1.*                     # 列出符合条件的 tag（筛选作用）
git tag                             # 创建轻量 tag（无 -m 标注信息）
git tag -a -m "first version"       # 创建含标注 tag
git tag -a f1bb97a(commit id)       # 为之前提交打 tag

git push origin --tags              # 推送所有本地 tag 到远程
git push origin                     # 推送指定本地 tag 到远程

git tag -d                          # 删除本地指定 tag
git push origin :refs/tags/         # 删除远程指定 tag

git fetch origin                    # 拉取远程指定 tag
git show                            # 显示指定 tag 详细信息
```

## 3. 参考

- [git 如何同步本地、远程的分支和tag信息](https://blog.csdn.net/wei371522/article/details/83186077)
- [Git查看、删除、重命名远程分支和tag](https://blog.zengrong.net/post/delete_git_remote_brahch/)
