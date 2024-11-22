# docker 安装 mysql

## 1. docker 常用命令

第一步 [下载 docker 安装包](https://docs.docker.com/get-started/#download-and-install-docker) 进行安装；

`docker` 常见命令：

```bash
docker version # 查看docker版本

# Version:           19.03.13
```

```bash
docker images # 查看已下载镜像
# REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
# mysql               5.7                 ae0658fdbad5        5 months ago        449MB
```

```bash
docker ps # 查看已运行实例
# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
# 8ca41780a8dd        mysql:5.7           "docker-entrypoint.s…"   16 minutes ago      Up 16 minutes       0.0.0.0:3306->3306/tcp, 33060/tcp   docker_mysql_57_test

```

```bash
docker search mysql # 搜索mysql镜像
```

可以访问[这里查看有哪些版本](https://hub.docker.com/_/mysql)。

```bash
docker pull mysql # 下载最新版本的镜像
docker pull mysql:5.7 # 下载指定版本的镜像
docker pull mysql:8.0
```

## 2. docker 安装 mysql

第二步下载 `mysql` 镜像：

```bash
docker pull mysql:5.7
```

```bash
# 运行实例
docker run --name docker_mysql_57_test -v [mysql_57_data本地存放目录]:/var/lib/mysql -d -p 3306:3306 mysql:5.7
```

```bash
# 进入实例终端
docker exec -it docker_mysql_57_test bash
```

## 3. 参考

- [docker 官网](https://docs.docker.com/)；
- [docker 中文社区](https://www.docker.org.cn/)；
