#!/bin/bash

name=demo-web
docker pull ocean/$name

# awk $0-表示所有 $1-表示第一个 $NF-表示最后一个 $(NF-1)-表示倒数第二个
# grep -F或--fixed-regexp 将范本样式视为固定字符串的列表
# grep -x或--line-regexp 只显示全列符合的列
if docker ps | grep $name | awk {'print $(NF)'} | grep -Fx $name; then
    echo "Container is already start"
    docker stop $name
    docker rm $name
    docker run -d --name $name -p 8080:80 ocean/$name
else
    echo "Container is not start!, starting"
    docker run -d --name $name -p 8080:80 ocean/$name
    echo "Finish starting"
fi

docker images | grep none | awk '{print $3}' | xargs docker rmi