'use stirct';
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const server = createServer();
const child = fork('./child.js');

server
  .on('connection', (socket) => {
    child.send('socket', socket);
  })
  .listen(1337);
