const { fork } = require('node:child_process');
const { cpus } = require('node:os');

cpus().forEach(() => {
    fork('./worker.js');
});
