'use strict';
const process = require('node:process');

process.on('message', (message, socket) => {
  if (message === 'socket') {
    socket.end('Child handled it.');
  }
});
