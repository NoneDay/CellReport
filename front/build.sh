#!/bin/bash 

echo "打包文件"
yarn build
echo "传输文件"

scp -r ./dist/** user01@139.217.218.207:/data/avue/avue-cli1

echo "部署成功"