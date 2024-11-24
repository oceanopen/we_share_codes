#!/bin/bash

# 构建镜像
docker build -t ocean/demo-web .

# 清除 tag 为 none 的 image
docker images | grep none | awk '{print $3}' | xargs docker rmi