// 创建大文件

const fs = require('node:fs');

const file = fs.createWriteStream('./big.text');
for (let i = 0; i <= 1e6; i++) {
    file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit. \n');
}
file.end();
