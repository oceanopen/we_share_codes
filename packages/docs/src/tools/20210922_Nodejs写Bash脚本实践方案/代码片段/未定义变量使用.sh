#!/bin/bash

set -u

# 这里是判断变量var是否等于字符串abc，但是var这个变量并没有声明
if [ "$var" = "abc" ]
then
   # 如果if判断里是true就在控制台打印 “ not abc”
   echo  "not abc"
else
   # 如果if判断里是false就在控制台打印 “ abc”
   echo "abc "
fi