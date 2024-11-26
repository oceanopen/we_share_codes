const process = require('node:process');
const { Readable } = require('node:stream');

const inStream = new Readable({
    read(_size) {
        this.push(String.fromCharCode(this.currentCharCode++));
        if (this.currentCharCode > 90) {
            this.push(null);
        }
    },
});
inStream.currentCharCode = 65;

inStream.pipe(process.stdout);
