const fs = require('node:fs');

try {
    fs.symlinkSync('./src/a.js', './b.js');
    console.log('创建软链成功');
}
catch (err) {
    console.error('创建软链失败 | err:', err);
}
