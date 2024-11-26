const { fork } = require('node:child_process');
const path = require('node:path');

const child = fork(path.resolve(__dirname, 'child.js'));

child.on('message', (msg) => {
    console.log('主进程收到子进程的信息：', msg);
});

child.send('Hey! 子进程');
