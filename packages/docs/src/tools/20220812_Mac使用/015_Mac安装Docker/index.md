# Mac 安装 Docker

## 1. 相关链接

- [Install Docker Desktop on Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Overview of installing Docker Compose](https://docs.docker.com/compose/install/)
- [Github Compose Releases](https://github.com/docker/compose/releases)
- [Install the Docker Compose standalone](https://docs.docker.com/compose/install/standalone/)

## 2. docker 命令运行

直接下载安装即可。安装后，即可运行 `docker` 命令:

```bash
docker --version
# Docker version 27.3.1, build ce12230

docker compose version
# Docker Compose version v2.30.3-desktop.1

which docker
# /usr/local/bin/docker

cd /usr/local/bin && ll
# ...
# lrwxr-xr-x  1 root  wheel    54B  7 14 23:54 docker -> /Applications/Docker.app/Contents/Resources/bin/docker
# lrwxr-xr-x  1 root  wheel    62B  7 14 23:54 docker-compose -> /Applications/Docker.app/Contents/Resources/bin/docker-compose
# lrwxr-xr-x  1 root  wheel    73B  7 14 23:54 docker-credential-desktop -> /Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop
# lrwxr-xr-x  1 root  wheel    77B  7 14 23:54 docker-credential-osxkeychain -> /Applications/Docker.app/Contents/Resources/bin/docker-credential-osxkeychain
# lrwxr-xr-x  1 root  wheel    60B  7 14 23:54 docker-index -> /Applications/Docker.app/Contents/Resources/bin/docker-index
# ...
```

## 3. docker-compose 命令运行

看上面的命令，正常 `docker-compose` 是可以运行的，但实际运行发现:

```bash
docker-compose version
# zsh: command not found: docker-compose
```

这个是因为 `/Applications/Docker.app/Contents/Resources/bin/docker-compose` 这个脚本是不存在的。

看[官网说明](https://docs.docker.com/compose/install/):

- After Docker Compose V1 was removed in Docker Desktop version 4.23.0 as it had reached end-of-life, the docker-compose command now points directly to the Docker Compose V2 binary, running in standalone mode. If you rely on Docker Desktop auto-update, the symlink might be broken and command unavailable, as the update doesn't ask for administrator password.

- This only affects Mac users. To fix this, either recreate the symlink:

  ```bash
  sudo rm /usr/local/bin/docker-compose
  sudo ln -s /Applications/Docker.app/Contents/Resources/cli-plugins/docker-compose /usr/local/bin/docker-compose
  ```

然后执行:

```bash
sudo rm /usr/local/bin/docker-compose
sudo ln -s /Applications/Docker.app/Contents/Resources/cli-plugins/docker-compose /usr/local/bin/docker-compose
```

验证:

```bash
docker-compose version
# Docker Compose version v2.30.3-desktop.1

cd /usr/local/bin && ll
# ...
# lrwxr-xr-x  1 root  wheel    70B 12 25 00:15 docker-compose -> /Applications/Docker.app/Contents/Resources/cli-plugins/docker-compose
# ...
```

发现 `docker-compose` 可正常使用了。

## 4. 手动安装 docker-compose

如果是 `linux` 环境执行以下命令即可:

```bash
# 下载 Docker Compose 的当前稳定版本
curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o docker-compose

# 将二进制文件移动到/usr/local/bin目录
sudo mv docker-compose /usr/local/bin

# 更改文件权限
sudo chmod +x /usr/local/bin/docker-compose
```

如果是 `macos` 环境，则需要手动下载了 https://github.com/docker/compose/releases。

下载对应的文件为:

```bash
echo docker-compose-$(uname -s)-$(uname -m)
# docker-compose-Darwin-arm64
```

然后:

```bash
# 将下载的文件放入指定的目录
mv docker-compose-darwin-aarch64 /usr/local/bin

# 将文件名修改成 docker-compose
mv docker-compose-darwin-aarch64 docker-compose

# 修改文件权限
sudo chmod +x /usr/local/bin/docker-compose

# 查看版本
docker-compose --version
```
