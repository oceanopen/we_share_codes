const fs = require('node:fs');
const process = require('node:process');
const zlib = require('node:zlib');

const file = process.argv[2];

fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(`${file}.gz`));
