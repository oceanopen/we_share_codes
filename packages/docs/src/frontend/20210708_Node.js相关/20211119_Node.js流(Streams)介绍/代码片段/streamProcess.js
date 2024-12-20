const fs = require('node:fs');
const process = require('node:process');
const zlib = require('node:zlib');

const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .on('data', () => process.stdout.write('.'))
  .pipe(fs.createWriteStream(`${file}.gzip`))
  .on('finish', () => console.log('Done'));
