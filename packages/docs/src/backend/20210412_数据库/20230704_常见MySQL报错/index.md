# 常见 MySQL 报错

## 1. Incorrect datetime value: '0000-00-00' for column

表字段类型为：`datetime(3)`。

`MySQL` 报 `incorrect datetime value '0000-00-00 00:00:00' for column` 错误原因，是由于在 `MySQL5.7` 版本以上，默认设置 `SQL_Mode` 模式，在模式里有 `NO_ZERO_DATE,NO_ZERO_IN_DATE`，存在表示系统里 `DATE` 类型字段不能有 `0` 值，所以在执行 `create` 或`update` 操作时会报此错误。

一般解决办法：修改 mysql 中的 `mysqld.cnf` 文件，设置 `sql_mode` 信息即可。

## 2. Authentication plugin 'caching_sha2_password' cannot be loaded

远程连接报错。

排查原因，查看身份验证类型:

```bash
mysql -u root -p
# 进入 mysql
# mysql> ...
```

继续执行:

```sql
-- mysql>

use mysql;
-- Database changed

SELECT Host, User, plugin from user;
-- +-----------+------------------+-----------------------+
-- | Host      | User             | plugin                |
-- +-----------+------------------+-----------------------+
-- | %         | root             | caching_sha2_password |
-- | localhost | mysql.infoschema | caching_sha2_password |
-- | localhost | mysql.session    | caching_sha2_password |
-- | localhost | mysql.sys        | caching_sha2_password |
-- | localhost | root             | caching_sha2_password |
-- +-----------+------------------+-----------------------+
-- 5 rows in set (0.00 sec)
```

修改身份验证类型(修改密码):

```sql
-- mysql>

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
-- Query OK, 0 rows affected (0.00 sec)

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- Query OK, 0 rows affected (0.01 sec)

-- 修改用户密码，假如之前密码是 root，改为 123456
-- 注意: mysql -h localhost -u root -p，仅通过 localhost 登录才能用 123456 登录
alter USER 'root'@'localhost' identified by '123456';

-- 注意: mysql -h 127.0.0.1 -u root -p，仅通过 IP 登录才能用 123456 登录
alter USER 'root'@'%' identified by '123456';
```

使生效:

```bash
# mysql>

FLUSH PRIVILEGES;
```

验证是否生效:

```sql
-- mysql>

SELECT Host, User, plugin from user;
-- # +-----------+------------------+-----------------------+
-- # | Host      | User             | plugin                |
-- # +-----------+------------------+-----------------------+
-- # | %         | root             | mysql_native_password |
-- # | localhost | mysql.infoschema | caching_sha2_password |
-- # | localhost | mysql.session    | caching_sha2_password |
-- # | localhost | mysql.sys        | caching_sha2_password |
-- # | localhost | root             | mysql_native_password |
-- # +-----------+------------------+-----------------------+
-- # 5 rows in set (0.00 sec)
```
