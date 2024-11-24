# Docker 下修改 mysql 容器中的 sql_mode 配置

## 1. 创建初始运行容器

```bash
docker run -d -p 3306:3306 --name docker_mysql_57_test -v /Users/[user]/MyFiles/Docker/docker_mysql_57_test_data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

创建成功，查看一下运行状态：

```bash
docker ps
# | CONTAINER ID | IMAGE     | COMMAND                | CREATED            | STATUS            | PORTS                             | NAMES                |
# | ------------ | --------- | ---------------------- | ------------------ | ----------------- | --------------------------------- | -------------------- |
# | 0c867bb8e98d | mysql:5.7 | "docker-entrypoint.s…" | About a minute ago | Up About a minute | 0.0.0.0:3306->3306/tcp, 33060/tcp | docker_mysql_57_test |
```

可以看到我们的容器正在运行中，现在进入容器，查看一下配置文件：

```bash
docker exec -it docker_mysql_57_test /bin/bash
# root@0c867bb8e98d:/#
```

继续执行:

```bash
# root@0c867bb8e98d:/#
cat /etc/mysql/my.cnf
# # Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved.

# # This program is free software; you can redistribute it and/or modify
# # it under the terms of the GNU General Public License, version 2.0,
# # as published by the Free Software Foundation.

# # This program is also distributed with certain software (including
# # but not limited to OpenSSL) that is licensed under separate terms,
# # as designated in a particular file or component or in included license
# # documentation.  The authors of MySQL hereby grant you an additional
# # permission to link the program and your derivative works with the
# # separately licensed software that they have included with MySQL.

# # This program is distributed in the hope that it will be useful,
# # but WITHOUT ANY WARRANTY; without even the implied warranty of
# # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# # GNU General Public License, version 2.0, for more details.

# # You should have received a copy of the GNU General Public License
# # along with this program; if not, write to the Free Software
# # Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

# !includedir /etc/mysql/conf.d/
# !includedir /etc/mysql/mysql.conf.d/
```

可以看到这里包含了两个目录下的文件，查看了一下 `mysql.conf.d`，发现有我们需要更改的文件:

```bash
# root@0c867bb8e98d:/#
cat /etc/mysql/mysql.conf.d/mysqld.cnf
# # Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
# #
# # This program is free software; you can redistribute it and/or modify
# # it under the terms of the GNU General Public License, version 2.0,
# # as published by the Free Software Foundation.
# #
# # This program is also distributed with certain software (including
# # but not limited to OpenSSL) that is licensed under separate terms,
# # as designated in a particular file or component or in included license
# # documentation.  The authors of MySQL hereby grant you an additional
# # permission to link the program and your derivative works with the
# # separately licensed software that they have included with MySQL.
# #
# # This program is distributed in the hope that it will be useful,
# # but WITHOUT ANY WARRANTY; without even the implied warranty of
# # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# # GNU General Public License, version 2.0, for more details.
# #
# # You should have received a copy of the GNU General Public License
# # along with this program; if not, write to the Free Software
# # Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

# #
# # The MySQL  Server configuration file.
# #
# # For explanations see
# # http://dev.mysql.com/doc/mysql/en/server-system-variables.html

# [mysqld]
# pid-file    = /var/run/mysqld/mysqld.pid
# socket      = /var/run/mysqld/mysqld.sock
# datadir     = /var/lib/mysql
# #log-error  = /var/log/mysql/error.log
# # By default we only accept connections from localhost
# #bind-address   = 127.0.0.1
# # Disabling symbolic-links is recommended to prevent assorted security risks
# symbolic-links=0
```

可以看到这里并没有 `sql_mode` 的配置，说明 `mysql` 使用了`默认的配置`，我们可以进入 `mysql` 查看一下:

```bash
# root@0c867bb8e98d:/#
mysql -u root -p
# Enter password:
# Welcome to the MySQL monitor.  Commands end with ; or \g.
# Your MySQL connection id is 4
# Server version: 5.7.32 MySQL Community Server (GPL)

# Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

# Oracle is a registered trademark of Oracle Corporation and/or its
# affiliates. Other names may be trademarks of their respective
# owners.

# Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

# mysql>
show variables like '%sql_mode%';
# +---------------+-------------------------------------------------------------------------------------------------------------------------------------------+
# | Variable_name | Value                                                                                                                                     |
# +---------------+-------------------------------------------------------------------------------------------------------------------------------------------+
# | sql_mode      | ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |
# +---------------+-------------------------------------------------------------------------------------------------------------------------------------------+
# 1 row in set (0.00 sec)
```

这个时候我们就可以去更改配置文件了，输入 `exit` 退出 `mysql` 控制台。

```bash
# mysql>
exit
# Bye
# root@0c867bb8e98d:/#
```

## 2. 修改配置

我们再查看下这个文件的内容 `cat /etc/mysql/mysql.conf.d/mysqld.cnf`。

复制内容，到本地新建的一个同名文件：

```bash
mkdir -p docker_mysql_57_test/mysql.conf.d
cd docker_mysql_57_test/mysql.conf.d
touch mysqld.cnf
```

然后在 `mysqld.cnf` 内容的 `[mysqld]` 下面添加 `sql_mode` 配置，如：

```ini
[mysqld]
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
datadir         = /var/lib/mysql
#log-error      = /var/log/mysql/error.log
# By default we only accept connections from localhost
#bind-address   = 127.0.0.1
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
sql_mode        = ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

## 新建容器

停止并删除 `docker_mysql_57_test` 容器:

```bash
docker stop docker_mysql_57_test
# docker_mysql_57_test

docker rm  docker_mysql_57_test
# docker_mysql_57_test
```

然后我们修改下 `docker run` 语句，把我们本地的配置文件映射覆盖到容器内部，重新配置一下容器：

```bash
docker run \
-d \
-p 3306:3306 \
--name docker_mysql_57_test \
-v /Users/[user]/MyFiles/Docker/docker_mysql_57_test_data:/var/lib/mysql \
-v /Users/[user]/MyFiles/Docker/docker_mysql_57_test/mysql.conf.d/mysqld.cnf:/etc/mysql/mysql.conf.d/mysqld.cnf \
-e MYSQL_ROOT_PASSWORD=root \
mysql:5.7
```

然后我们按照一开始的步骤，重新进入一下容器：

```bash
docker exec -it docker_mysql_57_test /bin/bash
```

然后看下是否有变化：

```bash
# root@45bdf3a1e79f:/#
mysql -u root -p
# Enter password:
# Welcome to the MySQL monitor.  Commands end with ; or \g.
# Your MySQL connection id is 3
# Server version: 5.7.32 MySQL Community Server (GPL)

# Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

# Oracle is a registered trademark of Oracle Corporation and/or its
# affiliates. Other names may be trademarks of their respective
# owners.

# Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

# mysql>
show variables like '%sql_mode%';
# +---------------+--------------------------------------------------------------------------------------------------------------+
# | Variable_name | Value                                                                                                        |
# +---------------+--------------------------------------------------------------------------------------------------------------+
# | sql_mode      | ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |
# +---------------+--------------------------------------------------------------------------------------------------------------+
# 1 row in set (0.00 sec)
```

由于配置文件是由我们本地映射过去的，所以如果还需要改什么配置的话，直接更改我们本地的配置文件就好了。
